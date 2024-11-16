import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

class LoginForm extends StatefulWidget {
  const LoginForm({super.key});

  @override
  _LoginFormState createState() => _LoginFormState();
}

class _LoginFormState extends State<LoginForm> {
  final TextEditingController _usernameController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();
  String message = '';
  bool _isPasswordVisible = false; // New variable to control password visibility

  String buildPath(String route) {
    return 'https://galaxycollapse.com/$route';
  }

  Future<void> doLogin() async {
    final String loginName = _usernameController.text;
    final String loginPassword = _passwordController.text;
    final Map<String, dynamic> obj = {
      'login': loginName,
      'password': loginPassword,
    };
    final String js = jsonEncode(obj);

    try {
      final response = await http.post(
        Uri.parse(buildPath("api/login")),
        headers: {'Content-Type': 'application/json'},
        body: js,
      );

      final Map<String, dynamic> res = jsonDecode(response.body);
      print("Parsed response data: $res");

      if (res['id'] == -1) {
        setState(() {
          message = 'Login failed: Incorrect credentials or account unverified';
        });
      } else if (res['id'] != null && res['id'].toString().isNotEmpty) {
        final user = {
          'firstName': res['firstName'],
          'lastName': res['lastName'],
          'email': res['email'],
          'id': res['id'],
        };

        setState(() {
          message = '';
        });

        Navigator.pushReplacementNamed(
          context,
          '/analyze',
          arguments: user,
        );
      } else {
        setState(() {
          message = 'Incorrect user credentials or verification needed';
        });
      }
    } catch (error) {
      setState(() {
        message = 'An error occurred: ${error.toString()}';
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        const Text(
          'LOGIN',
          style: TextStyle(color: Colors.white, fontSize: 24, letterSpacing: 2),
        ),
        const SizedBox(height: 20),
        TextField(
          controller: _usernameController,
          decoration: const InputDecoration(
            labelText: 'Username',
            labelStyle: TextStyle(color: Colors.blue), // Change label color
            filled: true,
            fillColor: Colors.white,
            border: OutlineInputBorder(),
          ),
          style: const TextStyle(
            color: Colors.black,
          ),
        ),
        const SizedBox(height: 10),
        TextField(
          controller: _passwordController,
          obscureText: !_isPasswordVisible, // Use _isPasswordVisible to toggle visibility
          decoration: InputDecoration(
            labelText: 'Password',
            labelStyle: const TextStyle(color: Colors.blue), // Change label color
            filled: true,
            fillColor: Colors.white,
            border: const OutlineInputBorder(),
            suffixIcon: IconButton(
              icon: Icon(
                _isPasswordVisible ? Icons.visibility : Icons.visibility_off,
              ),
              onPressed: () {
                setState(() {
                  _isPasswordVisible = !_isPasswordVisible;
                });
              },
            ),
          ),
          style: const TextStyle(
            color: Colors.black,
          ),
        ),
        const SizedBox(height: 20),
        ElevatedButton(
          onPressed: doLogin,
          child: const Text('Login'),
        ),
        const SizedBox(height: 10),
        Text(
          message,
          style: const TextStyle(color: Colors.red),
        ),
        const SizedBox(height: 10),
        GestureDetector(
          onTap: () {
            Navigator.pushNamed(context, '/register');
          },
          child: const Text(
            'Register Now',
            style: TextStyle(color: Colors.blue),
          ),
        ),
        const SizedBox(height: 10),
        GestureDetector(
          onTap: () {
            Navigator.pushNamed(context, '/resetpassword');
          },
          child: const Text(
            'Reset Password',
            style: TextStyle(color: Colors.blue),
          ),
        ),
        const SizedBox(height: 10),
        GestureDetector(
          onTap: () {
            Navigator.pushNamed(context, '/resend');
          },
          child: const Text(
            'Resend Email Verification',
            style: TextStyle(color: Colors.blue),
          ),
        ),
      ],
    );
  }
}


