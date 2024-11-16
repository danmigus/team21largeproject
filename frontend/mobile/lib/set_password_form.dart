import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

class SetPasswordForm extends StatefulWidget {
  const SetPasswordForm({super.key});

  @override
  _SetPasswordFormState createState() => _SetPasswordFormState();
}

class _SetPasswordFormState extends State<SetPasswordForm> {
  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();
  String message = '';

  String buildPath(String route) {
    return 'https://galaxycollapse.com/$route';
  }

  Future<void> setNewPassword() async {
    final String email = _emailController.text;
    final String password = _passwordController.text;

    if (email.isEmpty || password.isEmpty) {
      setState(() {
        message = 'Please enter both email and a new password.';
      });
      return;
    }

    final Map<String, dynamic> obj = {
      'email': email,
      'newPassword': password,
    };
    final String js = jsonEncode(obj);

    try {
      // Send the new password request to the server
      final response = await http.post(
        Uri.parse(buildPath("api/setpassword")),
        headers: {'Content-Type': 'application/json'},
        body: js,
      );

      final res = jsonDecode(response.body);
      print(res);

      setState(() {
        message = "New password set. You can now log in.";
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
          'Set New Password 🔑',
          style: TextStyle(fontSize: 24, letterSpacing: 1),
        ),
        const SizedBox(height: 20),
        Text(message, style: const TextStyle(color: Colors.red)),
        const SizedBox(height: 20),
        TextField(
          controller: _emailController,
          decoration: const InputDecoration(
            labelText: 'Re-enter email here',
            border: OutlineInputBorder(),
          ),
          keyboardType: TextInputType.emailAddress,
        ),
        const SizedBox(height: 10),
        TextField(
          controller: _passwordController,
          obscureText: true,
          decoration: const InputDecoration(
            labelText: 'Enter new password here',
            border: OutlineInputBorder(),
          ),
        ),
        const SizedBox(height: 10),
        ElevatedButton(
          onPressed: setNewPassword,
          child: const Text('Submit'),
        ),
        const SizedBox(height: 10),
        GestureDetector(
          onTap: () {
            Navigator.pop(context); // Navigate back to login
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
