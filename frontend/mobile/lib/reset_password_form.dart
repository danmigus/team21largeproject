import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

class ResetPasswordForm extends StatefulWidget {
  @override
  _ResetPasswordFormState createState() => _ResetPasswordFormState();
}

class _ResetPasswordFormState extends State<ResetPasswordForm> {
  final TextEditingController _emailController = TextEditingController();
  String message = '';

  String buildPath(String route) {
    return 'https://galaxycollapse.com/$route';
  }

  Future<void> resetPassword() async {
    final String email = _emailController.text;

    if (email.isEmpty) {
      setState(() {
        message = 'Please enter an email address.';
      });
      return;
    }

    final Map<String, dynamic> obj = {
      'email': email,
    };
    final String js = jsonEncode(obj);

    try {
      // Send the reset password request to the server
      final response = await http.post(
        Uri.parse(buildPath("api/resetpassword")),
        headers: {'Content-Type': 'application/json'},
        body: js,
      );

      final res = jsonDecode(response.body);
      print(res);

      setState(() {
        message = "Please check your email for a password reset link.";
      });
    } catch (error) {
      setState(() {
        message = '❌ Something went wrong...';
      });
      print(error);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        const Text(
          'Reset Password 🔑',
          style: TextStyle(fontSize: 24, letterSpacing: 1),
        ),
        const SizedBox(height: 20),
        Text(message, style: const TextStyle(color: Colors.red)),
        const SizedBox(height: 20),
        TextField(
          controller: _emailController,
          decoration: const InputDecoration(
            labelText: 'Enter email here',
            border: OutlineInputBorder(),
          ),
          keyboardType: TextInputType.emailAddress,
        ),
        const SizedBox(height: 10),
        ElevatedButton(
          onPressed: resetPassword,
          child: const Text('Submit'),
        ),
        const SizedBox(height: 10),
        GestureDetector(
          onTap: () {
            Navigator.pop(context); // Navigate back to login page
          },
          child: const Text(
            'Return to Login',
            style: TextStyle(color: Colors.blue),
          ),
        ),
      ],
    );
  }
}
