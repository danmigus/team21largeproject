import 'package:flutter/material.dart';
import 'login_page.dart';
import 'register_page.dart';
import 'reset_password_page.dart';
import 'resend_verification_page.dart';
import 'set_password_page.dart';
void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      theme: ThemeData.dark(),
      initialRoute: '/', // Set the initial route
      routes: {
        '/': (context) => const LoginPage(),
        '/register': (context) => RegisterPage(),
        '/resetpassword': (context) => ResetPasswordPage(),
        '/resend': (context) => ResendVerificationPage(),
        '/setpassword': (context) => SetPasswordPage()
      },
    );
  }
}