import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

class ResendVerificationForm extends StatefulWidget {
  @override
  _ResendVerificationFormState createState() => _ResendVerificationFormState();
}

class _ResendVerificationFormState extends State<ResendVerificationForm> {
  final TextEditingController _emailController = TextEditingController();
  String message = '';
  bool showThankYouMessage = false;

  String buildPath(String route) {
    return 'https://galaxycollapse.com/$route';
  }

  Future<void> doVerify() async {
    final String email = _emailController.text;

    // Check if email field is empty
    if (email.isEmpty) {
      setState(() {
        message = '❌ Please enter an email address.';
      });
      return;
    }

    // Prepare the verification payload
    final Map<String, dynamic> obj = {
      'email': email,
    };
    final String js = jsonEncode(obj);

    try {
      // Send the verification request to the server
      final response = await http.post(
        Uri.parse(buildPath("api/resend")),
        headers: {'Content-Type': 'application/json'},
        body: js,
      );

      final res = jsonDecode(response.body);
      print(res);

      // Handle the response from the server
      if (res['error'] == 'Updated Token') {
        setState(() {
          message = '✅ Updated token. Please return to login';
          showThankYouMessage = true; // Show thank-you message
        });
      } else {
        setState(() {
          message = '❌ Unsuccessful verification';
        });
      }
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
          'Resend email for verification 📧',
          style: TextStyle(fontSize: 24, letterSpacing: 1),
        ),
        const SizedBox(height: 20),
        Text(message, style: const TextStyle(color: Colors.red)),
        const SizedBox(height: 20),

        // Display email input form if `showThankYouMessage` is false
        if (!showThankYouMessage) ...[
          TextField(
            controller: _emailController,
            decoration: const InputDecoration(
              labelText: 'Enter the email you want to verify',
              border: OutlineInputBorder(),
            ),
            keyboardType: TextInputType.emailAddress,
          ),
          const SizedBox(height: 10),
          ElevatedButton(
            onPressed: doVerify,
            child: const Text('Submit'),
          ),
        ] else
          // Display thank-you message when `showThankYouMessage` is true
          const Text(
            'Thank you. Please check your email.',
            style: TextStyle(fontSize: 18, color: Colors.green),
          ),
        
        const SizedBox(height: 10),
        GestureDetector(
          onTap: () {
            Navigator.pop(context); // Return to login page
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
