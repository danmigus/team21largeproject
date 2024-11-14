import 'package:flutter/material.dart';
import 'set_password_form.dart';

class SetPasswordPage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Set New Password')),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: SetPasswordForm(),
      ),
    );
  }
}
