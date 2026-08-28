#include <iostream>
#include <fstream>
#include <sstream>
#include <string>
#include <vector>
#include <map>
#include <algorithm>
#include <chrono>
#include <ctime>
#include <iomanip>
#include <random>

// ==================== C++ DATA STRUCTURES ====================

struct User {
    std::string userId;
    std::string name;
    std::string email;
    std::string phone;
    std::string password;
    std::string role; // "adopter" or "owner"
    std::string address;
    std::string housingType;
    std::string petExperience;
};

struct MedicalInfo {
    bool vaccinated = true;
    bool spayedNeutered = true;
    bool microchipped = true;
    std::string healthNotes;
};

struct Pet {
    std::string id;
    std::string ownerId;
    std::string name;
    std::string animalType; // "Dog", "Cat", "Rabbit", "Bird", "Other"
    std::string breed;
    std::string age;
    std::string ageCategory; // "Young", "Adult", "Senior"
    std::string gender; // "Male", "Female"
    std::string size; // "Small", "Medium", "Large"
    std::string location;
    std::string description;
    std::vector<std::string> personality;
    std::vector<std::string> goodWith;
    MedicalInfo medicalInfo;
    std::string weight;
    std::string activityLevel; // "Low", "Moderate", "High"
    std::string adoptionFee;
    std::string shelterName;
    std::string status; // "AVAILABLE", "ADOPTED", "PENDING"
    std::string image;
    std::string dateAdded;
};

struct AdoptionApplication {
    std::string id;
    std::string petId;
    std::string petName;
    std::string petBreed;
    std::string petImage;
    std::string petType;
    std::string petLocation;
    std::string applicantName;
    std::string applicantEmail;
    std::string applicantPhone;
    std::string applicantAddress;
    std::string housingType;
    bool hasOtherPets = false;
    std::string petExperience;
    std::string fitReason;
    std::string dateApplied;
    std::string eligibilityResult; // "APPLICABLE" or "NOT_APPLICABLE"
    std::string ineligibilityReason;
};

struct Like {
    std::string likeId;
    std::string userId;
    std::string petId;
    std::string timestamp;
};

// Global in-memory data store cached from database/*.json
static std::vector<User> g_users;
static std::vector<Pet> g_pets;
static std::vector<AdoptionApplication> g_applications;
static std::vector<Like> g_likes;

// Forward declarations
std::string sanitizeString(const std::string& input);
int countWords(const std::string& text);
std::string generateUniqueId(const std::string& prefix);
std::string getCurrentDateStr();

// Simple Helper JSON Escape
std::string jsonEscape(const std::string& s) {
    std::ostringstream o;
    for (char c : s) {
        switch (c) {
            case '"': o << "\\\""; break;
            case '\\': o << "\\\\"; break;
            case '\b': o << "\\b"; break;
            case '\f': o << "\\f"; break;
            case '\n': o << "\\n"; break;
            case '\r': o << "\\r"; break;
            case '\t': o << "\\t"; break;
            default:
                if ('\x00' <= c && c <= '\x1f') {
                    o << "\\u" << std::hex << std::setw(4) << std::setfill('0') << (int)c;
                } else {
                    o << c;
                }
        }
    }
    return o.str();
}

// Extract string value from simple JSON object string
std::string extractJsonField(const std::string& json, const std::string& field) {
    std::string key = "\"" + field + "\"";
    size_t pos = json.find(key);
    if (pos == std::string::npos) return "";
    pos = json.find(":", pos);
    if (pos == std::string::npos) return "";
    pos = json.find_first_not_of(" \t\n\r", pos + 1);
    if (pos == std::string::npos) return "";

    if (json[pos] == '"') {
        size_t endPos = pos + 1;
        while (endPos < json.length()) {
            if (json[endPos] == '"' && json[endPos - 1] != '\\') break;
            endPos++;
        }
        if (endPos >= json.length()) return "";
        std::string raw = json.substr(pos + 1, endPos - pos - 1);
        // unescape quotes
        size_t p = 0;
        while ((p = raw.find("\\\"", p)) != std::string::npos) {
            raw.replace(p, 2, "\"");
            p += 1;
        }
        return raw;
    } else {
        size_t endPos = json.find_first_of(",}\n\r", pos);
        if (endPos == std::string::npos) endPos = json.length();
        std::string val = json.substr(pos, endPos - pos);
        // trim spaces
        val.erase(0, val.find_first_not_of(" \t\r\n"));
        val.erase(val.find_last_not_of(" \t\r\n") + 1);
        return val;
    }
}

// Extract string vector from JSON array string
std::vector<std::string> extractJsonArray(const std::string& json, const std::string& field) {
    std::vector<std::string> result;
    std::string key = "\"" + field + "\"";
    size_t pos = json.find(key);
    if (pos == std::string::npos) return result;
    size_t start = json.find("[", pos);
    size_t end = json.find("]", start);
    if (start == std::string::npos || end == std::string::npos) return result;

    std::string arrStr = json.substr(start + 1, end - start - 1);
    std::stringstream ss(arrStr);
    std::string token;
    while (std::getline(ss, token, ',')) {
        size_t q1 = token.find('"');
        size_t q2 = token.rfind('"');
        if (q1 != std::string::npos && q2 != std::string::npos && q2 > q1) {
            result.push_back(token.substr(q1 + 1, q2 - q1 - 1));
        }
    }
    return result;
}

// ==================== UTILITY FUNCTIONS ====================

int countWords(const std::string& text) {
    std::stringstream ss(text);
    std::string word;
    int count = 0;
    while (ss >> word) {
        count++;
    }
    return count;
}

std::string generateUniqueId(const std::string& prefix) {
    auto now = std::chrono::system_clock::now().time_since_epoch().count();
    std::random_device rd;
    std::mt19937 gen(rd());
    std::uniform_int_distribution<> dis(1000, 9999);
    return prefix + "-" + std::to_string(dis(gen)) + "-" + std::to_string(now % 100000);
}

std::string getCurrentDateStr() {
    auto t = std::time(nullptr);
    auto tm = *std::localtime(&t);
    std::ostringstream oss;
    oss << std::put_time(&tm, "%Y-%m-%d");
    return oss.str();
}

std::string sanitizeString(const std::string& input) {
    std::string res = input;
    size_t first = res.find_first_not_of(" \t\n\r");
    if (std::string::npos == first) return "";
    size_t last = res.find_last_not_of(" \t\n\r");
    return res.substr(first, (last - first + 1));
}

// ==================== MANUAL JSON SERIALIZATION ====================

std::string userToJson(const User& u) {
    std::ostringstream ss;
    ss << "{"
       << "\"userId\":\"" << jsonEscape(u.userId) << "\","
       << "\"name\":\"" << jsonEscape(u.name) << "\","
       << "\"email\":\"" << jsonEscape(u.email) << "\","
       << "\"phone\":\"" << jsonEscape(u.phone) << "\","
       << "\"role\":\"" << jsonEscape(u.role) << "\","
       << "\"address\":\"" << jsonEscape(u.address) << "\","
       << "\"housingType\":\"" << jsonEscape(u.housingType) << "\","
       << "\"petExperience\":\"" << jsonEscape(u.petExperience) << "\""
       << "}";
    return ss.str();
}

std::string petToJson(const Pet& p) {
    std::ostringstream ss;
    ss << "{"
       << "\"id\":\"" << jsonEscape(p.id) << "\","
       << "\"ownerId\":\"" << jsonEscape(p.ownerId) << "\","
       << "\"name\":\"" << jsonEscape(p.name) << "\","
       << "\"animalType\":\"" << jsonEscape(p.animalType) << "\","
       << "\"breed\":\"" << jsonEscape(p.breed) << "\","
       << "\"age\":\"" << jsonEscape(p.age) << "\","
       << "\"ageCategory\":\"" << jsonEscape(p.ageCategory) << "\","
       << "\"gender\":\"" << jsonEscape(p.gender) << "\","
       << "\"size\":\"" << jsonEscape(p.size) << "\","
       << "\"location\":\"" << jsonEscape(p.location) << "\","
       << "\"description\":\"" << jsonEscape(p.description) << "\","
       << "\"weight\":\"" << jsonEscape(p.weight) << "\","
       << "\"activityLevel\":\"" << jsonEscape(p.activityLevel) << "\","
       << "\"adoptionFee\":\"" << jsonEscape(p.adoptionFee) << "\","
       << "\"shelterName\":\"" << jsonEscape(p.shelterName) << "\","
       << "\"status\":\"" << jsonEscape(p.status) << "\","
       << "\"image\":\"" << jsonEscape(p.image) << "\","
       << "\"dateAdded\":\"" << jsonEscape(p.dateAdded) << "\","
       << "\"medicalInfo\":{"
       << "\"vaccinated\":" << (p.medicalInfo.vaccinated ? "true" : "false") << ","
       << "\"spayedNeutered\":" << (p.medicalInfo.spayedNeutered ? "true" : "false") << ","
       << "\"microchipped\":" << (p.medicalInfo.microchipped ? "true" : "false") << ","
       << "\"healthNotes\":\"" << jsonEscape(p.medicalInfo.healthNotes) << "\""
       << "},";
    
    ss << "\"personality\":[";
    for (size_t i = 0; i < p.personality.size(); ++i) {
        ss << "\"" << jsonEscape(p.personality[i]) << "\"" << (i + 1 < p.personality.size() ? "," : "");
    }
    ss << "],";

    ss << "\"goodWith\":[";
    for (size_t i = 0; i < p.goodWith.size(); ++i) {
        ss << "\"" << jsonEscape(p.goodWith[i]) << "\"" << (i + 1 < p.goodWith.size() ? "," : "");
    }
    ss << "]";

    ss << "}";
    return ss.str();
}

std::string applicationToJson(const AdoptionApplication& app) {
    std::ostringstream ss;
    ss << "{"
       << "\"id\":\"" << jsonEscape(app.id) << "\","
       << "\"petId\":\"" << jsonEscape(app.petId) << "\","
       << "\"petName\":\"" << jsonEscape(app.petName) << "\","
       << "\"petBreed\":\"" << jsonEscape(app.petBreed) << "\","
       << "\"petImage\":\"" << jsonEscape(app.petImage) << "\","
       << "\"petType\":\"" << jsonEscape(app.petType) << "\","
       << "\"petLocation\":\"" << jsonEscape(app.petLocation) << "\","
       << "\"applicantName\":\"" << jsonEscape(app.applicantName) << "\","
       << "\"applicantEmail\":\"" << jsonEscape(app.applicantEmail) << "\","
       << "\"applicantPhone\":\"" << jsonEscape(app.applicantPhone) << "\","
       << "\"applicantAddress\":\"" << jsonEscape(app.applicantAddress) << "\","
       << "\"housingType\":\"" << jsonEscape(app.housingType) << "\","
       << "\"hasOtherPets\":" << (app.hasOtherPets ? "true" : "false") << ","
       << "\"petExperience\":\"" << jsonEscape(app.petExperience) << "\","
       << "\"fitReason\":\"" << jsonEscape(app.fitReason) << "\","
       << "\"dateApplied\":\"" << jsonEscape(app.dateApplied) << "\","
       << "\"eligibilityResult\":\"" << jsonEscape(app.eligibilityResult) << "\","
       << "\"ineligibilityReason\":\"" << jsonEscape(app.ineligibilityReason) << "\""
       << "}";
    return ss.str();
}

std::string likeToJson(const Like& l) {
    std::ostringstream ss;
    ss << "{"
       << "\"likeId\":\"" << jsonEscape(l.likeId) << "\","
       << "\"userId\":\"" << jsonEscape(l.userId) << "\","
       << "\"petId\":\"" << jsonEscape(l.petId) << "\","
       << "\"timestamp\":\"" << jsonEscape(l.timestamp) << "\""
       << "}";
    return ss.str();
}

// ==================== DATABASE FUNCTIONS ====================

void loadUsers() {
    g_users.clear();
    std::ifstream file("database/users.json");
    if (!file.is_open()) return;
    std::string content((std::istreambuf_iterator<char>(file)), std::istreambuf_iterator<char>());
    file.close();

    // Read objects delimited by { ... }
    size_t pos = 0;
    while ((pos = content.find('{', pos)) != std::string::npos) {
        size_t end = content.find('}', pos);
        if (end == std::string::npos) break;
        std::string obj = content.substr(pos, end - pos + 1);

        User u;
        u.userId = extractJsonField(obj, "userId");
        u.name = extractJsonField(obj, "name");
        u.email = extractJsonField(obj, "email");
        u.phone = extractJsonField(obj, "phone");
        u.role = extractJsonField(obj, "role");
        u.address = extractJsonField(obj, "address");
        u.housingType = extractJsonField(obj, "housingType");
        u.petExperience = extractJsonField(obj, "petExperience");

        if (!u.email.empty()) {
            g_users.push_back(u);
        }
        pos = end + 1;
    }
}

void saveUsers() {
    std::ofstream file("database/users.json");
    if (!file.is_open()) return;
    file << "[\n";
    for (size_t i = 0; i < g_users.size(); ++i) {
        file << "  " << userToJson(g_users[i]) << (i + 1 < g_users.size() ? ",\n" : "\n");
    }
    file << "]\n";
    file.close();
}

void loadPets() {
    g_pets.clear();
    std::ifstream file("database/pets.json");
    if (!file.is_open()) return;
    std::string content((std::istreambuf_iterator<char>(file)), std::istreambuf_iterator<char>());
    file.close();

    size_t pos = 0;
    while ((pos = content.find('{', pos)) != std::string::npos) {
        // Find matching closing brace for pet object
        int braceCount = 0;
        size_t end = pos;
        for (; end < content.length(); ++end) {
            if (content[end] == '{') braceCount++;
            else if (content[end] == '}') {
                braceCount--;
                if (braceCount == 0) break;
            }
        }
        if (end >= content.length()) break;

        std::string obj = content.substr(pos, end - pos + 1);

        Pet p;
        p.id = extractJsonField(obj, "id");
        p.ownerId = extractJsonField(obj, "ownerId");
        p.name = extractJsonField(obj, "name");
        p.animalType = extractJsonField(obj, "animalType");
        p.breed = extractJsonField(obj, "breed");
        p.age = extractJsonField(obj, "age");
        p.ageCategory = extractJsonField(obj, "ageCategory");
        if (p.ageCategory.empty()) p.ageCategory = "Young";
        p.gender = extractJsonField(obj, "gender");
        if (p.gender.empty()) p.gender = "Male";
        p.size = extractJsonField(obj, "size");
        if (p.size.empty()) p.size = "Medium";
        p.location = extractJsonField(obj, "location");
        p.description = extractJsonField(obj, "description");
        p.weight = extractJsonField(obj, "weight");
        p.activityLevel = extractJsonField(obj, "activityLevel");
        if (p.activityLevel.empty()) p.activityLevel = "Moderate";
        p.adoptionFee = extractJsonField(obj, "adoptionFee");
        p.shelterName = extractJsonField(obj, "shelterName");
        p.status = extractJsonField(obj, "status");
        if (p.status.empty()) p.status = "AVAILABLE";
        p.image = extractJsonField(obj, "image");
        p.dateAdded = extractJsonField(obj, "dateAdded");
        if (p.dateAdded.empty()) p.dateAdded = getCurrentDateStr();

        p.personality = extractJsonArray(obj, "personality");
        p.goodWith = extractJsonArray(obj, "goodWith");

        p.medicalInfo.vaccinated = true;
        p.medicalInfo.spayedNeutered = true;
        p.medicalInfo.microchipped = true;
        p.medicalInfo.healthNotes = extractJsonField(obj, "healthNotes");

        if (!p.name.empty()) {
            g_pets.push_back(p);
        }
        pos = end + 1;
    }
}

void savePets() {
    std::ofstream file("database/pets.json");
    if (!file.is_open()) return;
    file << "[\n";
    for (size_t i = 0; i < g_pets.size(); ++i) {
        file << "  " << petToJson(g_pets[i]) << (i + 1 < g_pets.size() ? ",\n" : "\n");
    }
    file << "]\n";
    file.close();
}

void loadApplications() {
    g_applications.clear();
    std::ifstream file("database/applications.json");
    if (!file.is_open()) return;
    std::string content((std::istreambuf_iterator<char>(file)), std::istreambuf_iterator<char>());
    file.close();

    size_t pos = 0;
    while ((pos = content.find('{', pos)) != std::string::npos) {
        size_t end = content.find('}', pos);
        if (end == std::string::npos) break;
        std::string obj = content.substr(pos, end - pos + 1);

        AdoptionApplication app;
        app.id = extractJsonField(obj, "id");
        app.petId = extractJsonField(obj, "petId");
        app.petName = extractJsonField(obj, "petName");
        app.petBreed = extractJsonField(obj, "petBreed");
        app.petImage = extractJsonField(obj, "petImage");
        app.petType = extractJsonField(obj, "petType");
        app.petLocation = extractJsonField(obj, "petLocation");
        app.applicantName = extractJsonField(obj, "applicantName");
        app.applicantEmail = extractJsonField(obj, "applicantEmail");
        app.applicantPhone = extractJsonField(obj, "applicantPhone");
        app.applicantAddress = extractJsonField(obj, "applicantAddress");
        app.housingType = extractJsonField(obj, "housingType");
        app.petExperience = extractJsonField(obj, "petExperience");
        app.fitReason = extractJsonField(obj, "fitReason");
        app.dateApplied = extractJsonField(obj, "dateApplied");
        app.eligibilityResult = extractJsonField(obj, "eligibilityResult");
        app.ineligibilityReason = extractJsonField(obj, "ineligibilityReason");

        if (!app.id.empty()) {
            g_applications.push_back(app);
        }
        pos = end + 1;
    }
}

void saveApplications() {
    std::ofstream file("database/applications.json");
    if (!file.is_open()) return;
    file << "[\n";
    for (size_t i = 0; i < g_applications.size(); ++i) {
        file << "  " << applicationToJson(g_applications[i]) << (i + 1 < g_applications.size() ? ",\n" : "\n");
    }
    file << "]\n";
    file.close();
}

void loadLikes() {
    g_likes.clear();
    std::ifstream file("database/likes.json");
    if (!file.is_open()) return;
    std::string content((std::istreambuf_iterator<char>(file)), std::istreambuf_iterator<char>());
    file.close();

    size_t pos = 0;
    while ((pos = content.find('{', pos)) != std::string::npos) {
        size_t end = content.find('}', pos);
        if (end == std::string::npos) break;
        std::string obj = content.substr(pos, end - pos + 1);

        Like l;
        l.likeId = extractJsonField(obj, "likeId");
        l.userId = extractJsonField(obj, "userId");
        l.petId = extractJsonField(obj, "petId");
        l.timestamp = extractJsonField(obj, "timestamp");

        if (!l.petId.empty()) {
            g_likes.push_back(l);
        }
        pos = end + 1;
    }
}

void saveLikes() {
    std::ofstream file("database/likes.json");
    if (!file.is_open()) return;
    file << "[\n";
    for (size_t i = 0; i < g_likes.size(); ++i) {
        file << "  " << likeToJson(g_likes[i]) << (i + 1 < g_likes.size() ? ",\n" : "\n");
    }
    file << "]\n";
    file.close();
}

// ==================== USER FUNCTIONS ====================

User createUser(const std::string& name, const std::string& email, const std::string& phone, const std::string& role, const std::string& address, const std::string& housingType, const std::string& petExperience) {
    User newUser;
    newUser.userId = generateUniqueId("usr");
    newUser.name = name;
    newUser.email = email;
    newUser.phone = phone;
    newUser.role = role.empty() ? "adopter" : role;
    newUser.address = address;
    newUser.housingType = housingType.empty() ? "Apartment" : housingType;
    newUser.petExperience = petExperience.empty() ? "Experienced" : petExperience;

    for (auto& u : g_users) {
        if (u.email == email) {
            u.name = name;
            u.phone = phone;
            u.role = newUser.role;
            saveUsers();
            return u;
        }
    }

    g_users.push_back(newUser);
    saveUsers();
    return newUser;
}

User loginUser(const std::string& email, const std::string& phone, const std::string& role, const std::string& name) {
    for (const auto& u : g_users) {
        if (u.email == email) {
            return u;
        }
    }
    return createUser(name, email, phone, role, "", "", "");
}

User getUserById(const std::string& userId) {
    for (const auto& u : g_users) {
        if (u.userId == userId) return u;
    }
    return User();
}

bool updateUser(const User& updatedUser) {
    for (auto& u : g_users) {
        if (u.userId == updatedUser.userId || u.email == updatedUser.email) {
            u = updatedUser;
            saveUsers();
            return true;
        }
    }
    return false;
}

bool deleteUser(const std::string& userId) {
    auto it = std::remove_if(g_users.begin(), g_users.end(), [&](const User& u) {
        return u.userId == userId;
    });
    if (it != g_users.end()) {
        g_users.erase(it, g_users.end());
        saveUsers();
        return true;
    }
    return false;
}

// ==================== PET FUNCTIONS ====================

Pet addPet(const Pet& newPet) {
    Pet p = newPet;
    if (p.id.empty()) {
        p.id = generateUniqueId("pet");
    }
    if (p.dateAdded.empty()) {
        p.dateAdded = getCurrentDateStr();
    }
    if (p.status.empty()) {
        p.status = "AVAILABLE";
    }
    g_pets.push_back(p);
    savePets();
    return p;
}

std::vector<Pet> getAllPets() {
    return g_pets;
}

Pet getPetById(const std::string& petId) {
    for (const auto& p : g_pets) {
        if (p.id == petId) return p;
    }
    return Pet();
}

std::vector<Pet> searchPets(const std::string& query) {
    std::vector<Pet> results;
    std::string q = query;
    std::transform(q.begin(), q.end(), q.begin(), ::tolower);

    for (const auto& p : g_pets) {
        std::string name = p.name;
        std::string breed = p.breed;
        std::string type = p.animalType;
        std::transform(name.begin(), name.end(), name.begin(), ::tolower);
        std::transform(breed.begin(), breed.end(), breed.begin(), ::tolower);
        std::transform(type.begin(), type.end(), type.begin(), ::tolower);

        if (name.find(q) != std::string::npos || breed.find(q) != std::string::npos || type.find(q) != std::string::npos) {
            results.push_back(p);
        }
    }
    return results;
}

std::vector<Pet> filterPets(const std::string& animalType, const std::string& breed, const std::string& ageCategory, const std::string& size, const std::string& location, const std::string& gender) {
    std::vector<Pet> results;
    for (const auto& p : g_pets) {
        if (!animalType.empty() && animalType != "All" && p.animalType != animalType) continue;
        if (!breed.empty() && breed != "All" && p.breed != breed) continue;
        if (!ageCategory.empty() && ageCategory != "All" && p.ageCategory != ageCategory) continue;
        if (!size.empty() && size != "All" && p.size != size) continue;
        if (!location.empty() && location != "All" && p.location != location) continue;
        if (!gender.empty() && gender != "All" && p.gender != gender) continue;
        results.push_back(p);
    }
    return results;
}

bool updatePet(const Pet& pet) {
    for (auto& p : g_pets) {
        if (p.id == pet.id) {
            p = pet;
            savePets();
            return true;
        }
    }
    return false;
}

bool deletePet(const std::string& petId) {
    auto it = std::remove_if(g_pets.begin(), g_pets.end(), [&](const Pet& p) {
        return p.id == petId;
    });
    if (it != g_pets.end()) {
        g_pets.erase(it, g_pets.end());
        savePets();
        return true;
    }
    return false;
}

// ==================== ELIGIBILITY LOGIC ====================

std::pair<std::string, std::string> checkEligibility(const std::string& fitReason, const std::string& housingType, const std::string& petExperience, const Pet& pet) {
    // Rule 1: Fit reason length check (< 40 words)
    int words = countWords(fitReason);
    if (words < 40) {
        return {"NOT_APPLICABLE", "Please provide a more detailed response about why you would be a good fit for this pet. A minimum of 40 words is required."};
    }

    // Rule 2: Housing suitability check
    bool isLargePet = (pet.size == "Large" || pet.activityLevel == "High");
    bool requiresYard = false;
    for (const auto& g : pet.goodWith) {
        if (g == "Yard Homes" || g == "Fenced Yard" || g == "Farm Life" || g == "Spacious Homes" || g == "Active Runners") {
            requiresYard = true;
            break;
        }
    }

    if ((isLargePet || requiresYard) && housingType == "Apartment") {
        return {"NOT_APPLICABLE", "This pet requires a larger living space or a house with a yard suitable for their size and energy level."};
    }

    // Rule 3: Pet experience check
    bool requiresExperienced = false;
    for (const auto& g : pet.goodWith) {
        if (g == "Experienced Owners" || g == "Experienced Handlers" || g == "Experienced") {
            requiresExperienced = true;
            break;
        }
    }
    for (const auto& p : pet.personality) {
        if (p == "Protective" || p == "Genius" || p == "Focused" || p == "Athletic") {
            requiresExperienced = true;
            break;
        }
    }

    if (requiresExperienced && petExperience == "First-time owner") {
        return {"NOT_APPLICABLE", "This pet requires an adopter with more experience caring for animals."};
    }

    // All rules passed!
    return {"APPLICABLE", "Application successfully verified as applicable!"};
}

// ==================== APPLICATION FUNCTIONS ====================

AdoptionApplication submitApplication(const std::string& petId, const std::string& adopterId, const std::string& applicantName, const std::string& applicantEmail, const std::string& applicantPhone, const std::string& applicantAddress, const std::string& housingType, const std::string& petExperience, const std::string& fitReason) {
    Pet targetPet = getPetById(petId);

    // Run C++ Eligibility Check
    auto eligibility = checkEligibility(fitReason, housingType, petExperience, targetPet);

    AdoptionApplication app;
    app.id = generateUniqueId("FUR-2026");
    app.petId = petId;
    app.petName = targetPet.name.empty() ? "Pet" : targetPet.name;
    app.petBreed = targetPet.breed;
    app.petImage = targetPet.image;
    app.petType = targetPet.animalType;
    app.petLocation = targetPet.location;
    app.applicantName = applicantName;
    app.applicantEmail = applicantEmail;
    app.applicantPhone = applicantPhone;
    app.applicantAddress = applicantAddress.empty() ? targetPet.location : applicantAddress;
    app.housingType = housingType;
    app.petExperience = petExperience;
    app.fitReason = fitReason;
    app.dateApplied = getCurrentDateStr();
    app.eligibilityResult = eligibility.first;
    app.ineligibilityReason = eligibility.second;

    g_applications.push_back(app);
    saveApplications();
    return app;
}

bool validateApplication(const std::string& applicantName, const std::string& applicantEmail, const std::string& applicantPhone, const std::string& fitReason) {
    if (applicantName.empty() || applicantEmail.empty() || applicantPhone.empty() || fitReason.empty()) return false;
    if (applicantEmail.find('@') == std::string::npos) return false;
    return true;
}

AdoptionApplication getApplicationById(const std::string& applicationId) {
    for (const auto& a : g_applications) {
        if (a.id == applicationId) return a;
    }
    return AdoptionApplication();
}

// ==================== MATCH / LIKE FUNCTIONS ====================

Like saveLike(const std::string& userId, const std::string& petId) {
    for (const auto& l : g_likes) {
        if (l.userId == userId && l.petId == petId) {
            return l;
        }
    }
    Like newLike;
    newLike.likeId = generateUniqueId("like");
    newLike.userId = userId;
    newLike.petId = petId;
    newLike.timestamp = getCurrentDateStr();
    g_likes.push_back(newLike);
    saveLikes();
    return newLike;
}

bool removeLike(const std::string& userId, const std::string& petId) {
    auto it = std::remove_if(g_likes.begin(), g_likes.end(), [&](const Like& l) {
        return (l.userId == userId || userId == "default") && l.petId == petId;
    });
    if (it != g_likes.end()) {
        g_likes.erase(it, g_likes.end());
        saveLikes();
        return true;
    }
    return false;
}

std::vector<std::string> getLikedPets(const std::string& userId) {
    std::vector<std::string> likedPetIds;
    for (const auto& l : g_likes) {
        if (l.userId == userId || userId == "default") {
            likedPetIds.push_back(l.petId);
        }
    }
    return likedPetIds;
}

bool isPetLiked(const std::string& userId, const std::string& petId) {
    for (const auto& l : g_likes) {
        if ((l.userId == userId || userId == "default") && l.petId == petId) return true;
    }
    return false;
}

// ==================== MAIN CLI & JSON API ROUTER ====================

int main(int argc, char* argv[]) {
    // Load persisted database files into memory
    loadUsers();
    loadPets();
    loadApplications();
    loadLikes();

    // Read payload from CLI argument or stdin
    std::string payload = "";
    if (argc > 2) {
        payload = argv[2];
    }

    if (argc > 1) {
        std::string command = argv[1];

        // Action: GET ALL PETS
        if (command == "--get-pets" || command == "get_pets") {
            std::cout << "[\n";
            for (size_t i = 0; i < g_pets.size(); ++i) {
                std::cout << petToJson(g_pets[i]) << (i + 1 < g_pets.size() ? ",\n" : "\n");
            }
            std::cout << "]\n";
            return 0;
        }

        // Action: ADD NEW PET LISTING
        if (command == "add_pet") {
            Pet newPet;
            newPet.id = extractJsonField(payload, "id");
            newPet.name = extractJsonField(payload, "name");
            newPet.animalType = extractJsonField(payload, "animalType");
            newPet.breed = extractJsonField(payload, "breed");
            newPet.age = extractJsonField(payload, "age");
            newPet.ageCategory = extractJsonField(payload, "ageCategory");
            if (newPet.ageCategory.empty()) newPet.ageCategory = "Young";
            newPet.gender = extractJsonField(payload, "gender");
            if (newPet.gender.empty()) newPet.gender = "Male";
            newPet.size = extractJsonField(payload, "size");
            if (newPet.size.empty()) newPet.size = "Medium";
            newPet.location = extractJsonField(payload, "location");
            newPet.description = extractJsonField(payload, "description");
            newPet.image = extractJsonField(payload, "image");
            newPet.shelterName = extractJsonField(payload, "shelterName");
            newPet.status = "AVAILABLE";

            newPet.personality = {"Loving", "Friendly", "Rescued"};
            newPet.goodWith = {"Families", "Kids", "Friendly Homes"};
            newPet.medicalInfo.vaccinated = true;
            newPet.medicalInfo.spayedNeutered = true;
            newPet.medicalInfo.microchipped = true;
            newPet.medicalInfo.healthNotes = "Health verified by foster owner";

            Pet created = addPet(newPet);
            std::cout << petToJson(created) << "\n";
            return 0;
        }

        // Action: SUBMIT ADOPTION APPLICATION WITH ELIGIBILITY CHECK
        if (command == "submit_application") {
            std::string petId = extractJsonField(payload, "petId");
            std::string name = extractJsonField(payload, "applicantName");
            std::string email = extractJsonField(payload, "applicantEmail");
            std::string phone = extractJsonField(payload, "applicantPhone");
            std::string address = extractJsonField(payload, "applicantAddress");
            std::string housing = extractJsonField(payload, "housingType");
            std::string experience = extractJsonField(payload, "petExperience");
            std::string fit = extractJsonField(payload, "fitReason");

            AdoptionApplication app = submitApplication(petId, "user-1", name, email, phone, address, housing, experience, fit);
            std::cout << applicationToJson(app) << "\n";
            return 0;
        }

        // Action: USER SIGN-IN / LOGIN
        if (command == "login") {
            std::string name = extractJsonField(payload, "name");
            std::string email = extractJsonField(payload, "email");
            std::string phone = extractJsonField(payload, "phone");
            std::string role = extractJsonField(payload, "role");

            User u = loginUser(email, phone, role, name);
            std::cout << userToJson(u) << "\n";
            return 0;
        }

        // Action: SAVE LIKE
        if (command == "save_like") {
            std::string uId = extractJsonField(payload, "userId");
            if (uId.empty()) uId = "default";
            std::string pId = extractJsonField(payload, "petId");
            if (!pId.empty()) {
                saveLike(uId, pId);
            }
            auto ids = getLikedPets(uId);
            std::cout << "[\n";
            for (size_t i = 0; i < ids.size(); ++i) {
                std::cout << "\"" << jsonEscape(ids[i]) << "\"" << (i + 1 < ids.size() ? ",\n" : "\n");
            }
            std::cout << "]\n";
            return 0;
        }

        // Action: REMOVE LIKE
        if (command == "remove_like") {
            std::string uId = extractJsonField(payload, "userId");
            if (uId.empty()) uId = "default";
            std::string pId = extractJsonField(payload, "petId");
            if (!pId.empty()) {
                removeLike(uId, pId);
            }
            auto ids = getLikedPets(uId);
            std::cout << "[\n";
            for (size_t i = 0; i < ids.size(); ++i) {
                std::cout << "\"" << jsonEscape(ids[i]) << "\"" << (i + 1 < ids.size() ? ",\n" : "\n");
            }
            std::cout << "]\n";
            return 0;
        }

        // Action: GET LIKES
        if (command == "--get-likes" || command == "get_likes") {
            std::string uId = (argc > 2) ? argv[2] : "default";
            auto ids = getLikedPets(uId);
            std::cout << "[\n";
            for (size_t i = 0; i < ids.size(); ++i) {
                std::cout << "\"" << jsonEscape(ids[i]) << "\"" << (i + 1 < ids.size() ? ",\n" : "\n");
            }
            std::cout << "]\n";
            return 0;
        }
    }

    std::cout << "{\"status\":\"ok\",\"service\":\"FurEver C++ Backend API\",\"version\":\"1.0.0\"}\n";
    return 0;
}
