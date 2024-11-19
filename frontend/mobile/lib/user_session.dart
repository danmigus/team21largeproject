class UserSession {
  static final UserSession _instance = UserSession._internal();

  factory UserSession() {
    return _instance;
  }

  UserSession._internal();

  String? userId;
  String? firstName;
  String? lastName;
  String? email;

  void clearSession() {
    userId = null;
    firstName = null;
    lastName = null;
    email = null;
  }
   String getUserId() {
    if (userId == null || userId!.isEmpty) {
      throw Exception("User ID is not set.");
    }
    return userId!;
  }
}
