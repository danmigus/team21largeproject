import 'package:flutter/material.dart';

class LoginForm extends StatefulWidget {
  const LoginForm({super.key});

  @override
  LoginFormState createState() => LoginFormState();  // Removed underscore
}

class LoginFormState extends State<LoginForm> {
  final _usernameController = TextEditingController();
  final _passwordController = TextEditingController();
  String message = '';

  void doLogin() {
    if (_usernameController.text == 'user' && _passwordController.text == 'password') {
      Navigator.pushNamed(context, '/analyze');
    } else {
      setState(() {
        message = 'Incorrect user credentials or verification needed';
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
            filled: true,
            fillColor: Colors.white,
            border: OutlineInputBorder(),
          ),
        ),
        const SizedBox(height: 10),
        TextField(
          controller: _passwordController,
          obscureText: true,
          decoration: const InputDecoration(
            labelText: 'Password',
            filled: true,
            fillColor: Colors.white,
            border: OutlineInputBorder(),
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
            // Navigate to Register screen
          },
          child: const Text(
            'Register Now',
            style: TextStyle(color: Colors.blue),
          ),
        ),
        const SizedBox(height: 10),
        GestureDetector(
          onTap: () {
            // Navigate to Reset Password screen
          },
          child: const Text(
            'Reset Password',
            style: TextStyle(color: Colors.blue),
          ),
        ),
        const SizedBox(height: 10),
        GestureDetector(
          onTap: () {
            // Navigate to Resend Verification screen
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

