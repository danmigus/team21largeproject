import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

class RegisterForm extends StatefulWidget {
  @override
  _RegisterFormState createState() => _RegisterFormState();
}

class _RegisterFormState extends State<RegisterForm> {
  //Show for email verification
  void showSuccessPopup() {
  showDialog(
    context: context,
    builder: (BuildContext context) {
      return AlertDialog(
        title: const Text("Registration Successful"),
        content: const Text("Please check your email for the verification link."),
        actions: <Widget>[
          TextButton(
            onPressed: () {
              Navigator.of(context).pop(); // Close the popup
              Navigator.pop(context); // Navigate back to the login page
            },
            child: const Text("OK"),
          ),
        ],
      );
    },
  );
  }

  final TextEditingController _firstNameController = TextEditingController();
  final TextEditingController _lastNameController = TextEditingController();
  final TextEditingController _usernameController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();
  final TextEditingController _emailController = TextEditingController();
  String message = '';

  String buildPath(String route) {
    return 'https://galaxycollapse.com/$route';
  }

  Future<void> doRegister() async {
    final String firstName = _firstNameController.text;
    final String lastName = _lastNameController.text;
    final String username = _usernameController.text;
    final String password = _passwordController.text;
    final String email = _emailController.text;

    // Check if any field is empty
    if (firstName.isEmpty || lastName.isEmpty || username.isEmpty || password.isEmpty || email.isEmpty) {
      setState(() {
        message = "😵‍💫 One or more fields missing 😵‍💫";
      });
      return;
    }

    // Prepare the registration payload
    final Map<String, dynamic> obj = {
      'us': username,
      'pass': password,
      'f': firstName,
      'l': lastName,
      'em': email,
    };

    final String js = jsonEncode(obj);

    try {
      // Send the registration request to the server
      final response = await http.post(
        Uri.parse(buildPath("api/register")),
        headers: {'Content-Type': 'application/json'},
        body: js,
      );

      final res = jsonDecode(response.body);
      print(res);

      if (res['error'] == "Username or email already exists") {
        setState(() {
          message = "Username or email already exists 😡";
        });
        return;
      }

      // Hide the registration form and show the thank-you message
      showSuccessPopup();
    } catch (error) {
      setState(() {
        message = '❌ Unsuccessful Registration...';
      });
      print(error);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        const Text(
          'Registration 📝',
          style: TextStyle(fontSize: 24, letterSpacing: 2),
        ),
        const SizedBox(height: 20),
        Text(message, style: const TextStyle(color: Colors.red)),
        const SizedBox(height: 20),
        TextField(
          controller: _firstNameController,
          decoration: const InputDecoration(
            labelText: 'First Name',
            border: OutlineInputBorder(),
          ),
        ),
        const SizedBox(height: 10),
        TextField(
          controller: _lastNameController,
          decoration: const InputDecoration(
            labelText: 'Last Name',
            border: OutlineInputBorder(),
          ),
        ),
        const SizedBox(height: 10),
        TextField(
          controller: _usernameController,
          decoration: const InputDecoration(
            labelText: 'Username',
            border: OutlineInputBorder(),
          ),
        ),
        const SizedBox(height: 10),
        TextField(
          controller: _passwordController,
          obscureText: true,
          decoration: const InputDecoration(
            labelText: 'Password',
            border: OutlineInputBorder(),
          ),
        ),
        const SizedBox(height: 10),
        TextField(
          controller: _emailController,
          decoration: const InputDecoration(
            labelText: 'Email',
            border: OutlineInputBorder(),
          ),
          keyboardType: TextInputType.emailAddress,
        ),
        const SizedBox(height: 20),
        ElevatedButton(
          onPressed: doRegister,
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
