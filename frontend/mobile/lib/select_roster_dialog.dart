import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

class SelectRosterDialog extends StatelessWidget {
  final List<Map<String, dynamic>> rosters;
  final Function(String selectedRosterName) onSelectRoster;

  const SelectRosterDialog({
    super.key,
    required this.rosters,
    required this.onSelectRoster,
  });

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      title: const Text('Select Roster'),
      content: SizedBox(
        width: double.maxFinite,
        child: rosters.isEmpty
            ? const Text('No rosters available. Create one to get started.')
            : ListView.builder(
                shrinkWrap: true,
                itemCount: rosters.length,
                itemBuilder: (context, index) {
                  final roster = rosters[index];
                  return ListTile(
                    title: Text(roster['RosterName']),
                    subtitle: Text('${roster['players'].length} players'),
                    trailing: ElevatedButton(
                      onPressed: () {
                        onSelectRoster(roster['RosterName']);
                        Navigator.pop(context); // Close dialog
                      },
                      child: const Text('Select'),
                    ),
                  );
                },
              ),
      ),
      actions: [
        TextButton(
          onPressed: () => Navigator.pop(context),
          child: const Text('Cancel'),
        ),
      ],
    );
  }
}
