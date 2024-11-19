import 'package:flutter/material.dart';
import 'rosterbuilder_form.dart';
import 'user_session.dart';

class RosterBuilderPage extends StatelessWidget {
  const RosterBuilderPage({super.key});

  @override
  Widget build(BuildContext context) {
    // Fetch userId from UserSession
    final String? userId = UserSession().userId;

    if (userId == null || userId.isEmpty) {
      return Scaffold(
        appBar: AppBar(
          title: const Text('Roster Builder'),
        ),
        body: const Center(
          child: Text('Error: User ID not found. Please log in again.'),
        ),
      );
    }

    return Scaffold(
      appBar: AppBar(
        title: const Text('Roster Builder'),
      ),
      body: RosterBuilderForm(userId: userId),
    );
  }
}
