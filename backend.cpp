#include <iostream>
#include <fstream>
#include <string>
#include <sstream>
#include <chrono>
#include <ctime>
#include <iomanip>
#include <filesystem>
#include <cstring>
#include <algorithm>
#include <cctype>

#ifdef _WIN32
  #include <winsock2.h>
  #include <ws2tcpip.h>
#else
  #include <sys/socket.h>
  #include <netinet/in.h>
  #include <unistd.h>
  #include <arpa/inet.h>
#endif

namespace fs = std::filesystem;

// Function to get current timestamp string
std::string getCurrentTimestamp() {
    auto now = std::chrono::system_clock::now();
    auto in_time_t = std::chrono::system_clock::to_time_t(now);
    std::stringstream ss;
    ss << std::put_time(std::localtime(&in_time_t), "%Y%m%d_%H%M%S");
    return ss.str();
}

// Function to extract a simple field value from JSON string (fallback if full parser not needed)
std::string extractJsonField(const std::string& json, const std::string& fieldName) {
    std::string key = "\"" + fieldName + "\"";
    size_t pos = json.find(key);
    if (pos == std::string::npos) return "";

    pos = json.find(':', pos);
    if (pos == std::string::npos) return "";

    // Skip whitespace
    pos++;
    while (pos < json.length() && (json[pos] == ' ' || json[pos] == '\t' || json[pos] == '\r' || json[pos] == '\n')) {
        pos++;
    }

    if (pos >= json.length()) return "";

    if (json[pos] == '"') {
        pos++;
        size_t endPos = json.find('"', pos);
        if (endPos != std::string::npos) {
            return json.substr(pos, endPos - pos);
        }
    } else {
        size_t endPos = json.find_first_of(",}\n\r", pos);
        if (endPos != std::string::npos) {
            std::string val = json.substr(pos, endPos - pos);
            // Trim whitespace
            val.erase(val.find_last_not_of(" \t\n\r") + 1);
            return val;
        }
    }
    return "";
}

// Clean and sanitize string for filename
std::string sanitizeFilename(const std::string& input) {
    std::string clean = "";
    for (char c : input) {
        if (std::isalnum(c) || c == '-' || c == '_') {
            clean += c;
        }
    }
    return clean.empty() ? "unnamed" : clean;
}

// Helper to save JSON data to FormDataJson directory
std::string saveFormDataToJson(const std::string& jsonData, const std::string& targetDir = "FormDataJson") {
    try {
        // Ensure directory exists
        if (!fs::exists(targetDir)) {
            fs::create_directories(targetDir);
            std::cout << "[C++ Backend] Created directory: " << targetDir << std::endl;
        }

        // Try extracting application id or applicant name or pet name
        std::string appId = extractJsonField(jsonData, "id");
        std::string petName = extractJsonField(jsonData, "petName");
        std::string applicantName = extractJsonField(jsonData, "applicantName");
        std::string timestamp = getCurrentTimestamp();

        std::string filename;
        if (!appId.empty()) {
            filename = sanitizeFilename(appId) + "_" + timestamp + ".json";
        } else if (!petName.empty() || !applicantName.empty()) {
            filename = "adoption_" + sanitizeFilename(petName) + "_" + sanitizeFilename(applicantName) + "_" + timestamp + ".json";
        } else {
            filename = "form_data_" + timestamp + ".json";
        }

        fs::path filePath = fs::path(targetDir) / filename;

        // Write file
        std::ofstream outFile(filePath);
        if (!outFile.is_open()) {
            std::cerr << "[C++ Backend Error] Could not open file for writing: " << filePath << std::endl;
            return "";
        }

        outFile << jsonData << std::endl;
        outFile.close();

        std::cout << "[C++ Backend] Successfully saved adoption form data to: " << filePath.string() << std::endl;
        return filePath.string();
    } catch (const std::exception& e) {
        std::cerr << "[C++ Backend Exception] " << e.what() << std::endl;
        return "";
    }
}

#ifndef _WIN32
// Lightweight HTTP server loop
void runHttpServer(int port = 5050, const std::string& targetDir = "FormDataJson") {
    int server_fd, new_socket;
    struct sockaddr_in address;
    int opt = 1;
    int addrlen = sizeof(address);

    if ((server_fd = socket(AF_INET, SOCK_STREAM, 0)) == 0) {
        perror("[C++ Backend] socket failed");
        return;
    }

    if (setsockopt(server_fd, SOL_SOCKET, SO_REUSEADDR | SO_REUSEPORT, &opt, sizeof(opt))) {
        perror("[C++ Backend] setsockopt failed");
        return;
    }

    address.sin_family = AF_INET;
    address.sin_addr.s_addr = INADDR_ANY;
    address.sin_port = htons(port);

    if (bind(server_fd, (struct sockaddr*)&address, sizeof(address)) < 0) {
        perror("[C++ Backend] bind failed");
        return;
    }

    if (listen(server_fd, 10) < 0) {
        perror("[C++ Backend] listen failed");
        return;
    }

    std::cout << "=================================================" << std::endl;
    std::cout << "[C++ Adoption Form Backend] Running on port " << port << std::endl;
    std::cout << "[C++ Adoption Form Backend] Target directory: " << targetDir << std::endl;
    std::cout << "=================================================" << std::endl;

    while (true) {
        if ((new_socket = accept(server_fd, (struct sockaddr*)&address, (socklen_t*)&addrlen)) < 0) {
            perror("[C++ Backend] accept error");
            continue;
        }

        char buffer[65536] = {0};
        ssize_t bytes_read = read(new_socket, buffer, sizeof(buffer) - 1);
        if (bytes_read > 0) {
            std::string request(buffer, bytes_read);

            // Check if CORS preflight OPTIONS request
            if (request.rfind("OPTIONS", 0) == 0) {
                std::string response = "HTTP/1.1 204 No Content\r\n"
                                       "Access-Control-Allow-Origin: *\r\n"
                                       "Access-Control-Allow-Methods: GET, POST, OPTIONS\r\n"
                                       "Access-Control-Allow-Headers: Content-Type\r\n\r\n";
                send(new_socket, response.c_str(), response.length(), 0);
            } else if (request.rfind("POST", 0) == 0) {
                // Find body (separated by double CRLF)
                size_t body_pos = request.find("\r\n\r\n");
                std::string body = "";
                if (body_pos != std::string::npos) {
                    body = request.substr(body_pos + 4);
                }

                if (!body.empty()) {
                    std::string savedFile = saveFormDataToJson(body, targetDir);
                    std::string jsonResponse;
                    if (!savedFile.empty()) {
                        jsonResponse = "{\"status\":\"success\",\"message\":\"Adoption form saved successfully in C++ backend\",\"file\":\"" + savedFile + "\"}";
                    } else {
                        jsonResponse = "{\"status\":\"error\",\"message\":\"Failed to save form data\"}";
                    }

                    std::string httpResponse = "HTTP/1.1 200 OK\r\n"
                                               "Content-Type: application/json\r\n"
                                               "Access-Control-Allow-Origin: *\r\n"
                                               "Content-Length: " + std::to_string(jsonResponse.length()) + "\r\n\r\n" +
                                               jsonResponse;
                    send(new_socket, httpResponse.c_str(), httpResponse.length(), 0);
                } else {
                    std::string jsonResponse = "{\"status\":\"error\",\"message\":\"Empty payload\"}";
                    std::string httpResponse = "HTTP/1.1 400 Bad Request\r\n"
                                               "Content-Type: application/json\r\n"
                                               "Access-Control-Allow-Origin: *\r\n"
                                               "Content-Length: " + std::to_string(jsonResponse.length()) + "\r\n\r\n" +
                                               jsonResponse;
                    send(new_socket, httpResponse.c_str(), httpResponse.length(), 0);
                }
            } else if (request.rfind("GET /health", 0) == 0 || request.rfind("GET /", 0) == 0) {
                std::string jsonResponse = "{\"status\":\"ok\",\"service\":\"C++ Adoption Form Backend\",\"targetDirectory\":\"" + targetDir + "\"}";
                std::string httpResponse = "HTTP/1.1 200 OK\r\n"
                                           "Content-Type: application/json\r\n"
                                           "Access-Control-Allow-Origin: *\r\n"
                                           "Content-Length: " + std::to_string(jsonResponse.length()) + "\r\n\r\n" +
                                           jsonResponse;
                send(new_socket, httpResponse.c_str(), httpResponse.length(), 0);
            } else {
                std::string jsonResponse = "{\"status\":\"error\",\"message\":\"Not found\"}";
                std::string httpResponse = "HTTP/1.1 404 Not Found\r\n"
                                           "Content-Type: application/json\r\n"
                                           "Access-Control-Allow-Origin: *\r\n"
                                           "Content-Length: " + std::to_string(jsonResponse.length()) + "\r\n\r\n" +
                                           jsonResponse;
                send(new_socket, httpResponse.c_str(), httpResponse.length(), 0);
            }
        }
        close(new_socket);
    }
    close(server_fd);
}
#endif

int main(int argc, char* argv[]) {
    std::string targetDir = "FormDataJson";

    // 1. If CLI argument contains --serve or -s, run in HTTP server mode
    if (argc >= 2 && (std::string(argv[1]) == "--serve" || std::string(argv[1]) == "-s")) {
        int port = 5050;
        if (argc >= 3) {
            port = std::stoi(argv[2]);
        }
        #ifndef _WIN32
        runHttpServer(port, targetDir);
        #else
        std::cout << "HTTP Server mode not supported on this platform build." << std::endl;
        #endif
        return 0;
    }

    // 2. If CLI argument is passed with JSON string directly
    if (argc >= 2 && std::string(argv[1]) != "--help") {
        std::string jsonInput = argv[1];
        std::string savedPath = saveFormDataToJson(jsonInput, targetDir);
        if (!savedPath.empty()) {
            std::cout << "{\"status\":\"success\",\"file\":\"" << savedPath << "\"}" << std::endl;
            return 0;
        } else {
            std::cerr << "{\"status\":\"error\",\"message\":\"Failed to save\"}" << std::endl;
            return 1;
        }
    }

    // 3. Read from standard input (stdin) if data is piped
    std::stringstream buffer;
    buffer << std::cin.rdbuf();
    std::string inputData = buffer.str();

    if (!inputData.empty()) {
        std::string savedPath = saveFormDataToJson(inputData, targetDir);
        if (!savedPath.empty()) {
            std::cout << "{\"status\":\"success\",\"file\":\"" << savedPath << "\"}" << std::endl;
            return 0;
        } else {
            std::cerr << "{\"status\":\"error\",\"message\":\"Failed to save\"}" << std::endl;
            return 1;
        }
    }

    // Default help / usage
    std::cout << "C++ Adoption Form Backend" << std::endl;
    std::cout << "Usage:" << std::endl;
    std::cout << "  1. Direct argument: ./backend_handler '{\"applicantName\":\"Alice\", ...}'" << std::endl;
    std::cout << "  2. Stdin pipe:      cat form.json | ./backend_handler" << std::endl;
    std::cout << "  3. HTTP Server:     ./backend_handler --serve [port]" << std::endl;

    return 0;
}
