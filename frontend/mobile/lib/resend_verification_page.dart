import 'package:flutter/material.dart';
import 'resend_verification_form.dart';

class ResendVerificationPage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Resend Verification Email')),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: ResendVerificationForm(),
      ),
    );
  }
}
