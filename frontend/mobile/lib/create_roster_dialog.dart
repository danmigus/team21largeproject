import 'package:flutter/material.dart';
import 'dart:convert';
import 'package:http/http.dart' as http;

class CreateRosterDialog extends StatefulWidget {
  final String userId;
  final Function(String newRosterName) onSuccess;

  const CreateRosterDialog({
    super.key,
    required this.userId,
    required this.onSuccess,
  });

  @override
  _CreateRosterDialogState createState() => _CreateRosterDialogState();
}

class _CreateRosterDialogState extends State<CreateRosterDialog> {
  final TextEditingController _rosterNameController = TextEditingController();
  bool isSubmitting = false;
  String error = '';

  Future<void> createRoster() async {
    if (_rosterNameController.text.trim().isEmpty) {
      setState(() {
        error = 'Roster name cannot be empty.';
      });
      return;
    }

    setState(() {
      isSubmitting = true;
      error = '';
    });

    try {
      final response = await http.post(
        Uri.parse('https://galaxycollapse.com/api/newroster'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'userId': widget.userId,
          'rosterName': _rosterNameController.text.trim(),
        }),
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        if (data['error'] != '') {
          setState(() {
            error = data['error'];
          });
        } else {
          widget.onSuccess(_rosterNameController.text.trim());
          Navigator.pop(context); // Close the dialog
        }
      } else {
        setState(() {
          error = 'Failed to create roster. Please try again.';
        });
      }
    } catch (e) {
      setState(() {
        error = e.toString();
      });
    } finally {
      setState(() {
        isSubmitting = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      title: const Text('Create New Roster'),
      content: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          TextField(
            controller: _rosterNameController,
            decoration: InputDecoration(
              labelText: 'Roster Name',
              errorText: error.isEmpty ? null : error,
            ),
            enabled: !isSubmitting,
          ),
        ],
      ),
      actions: [
        TextButton(
          onPressed: isSubmitting ? null : () => Navigator.pop(context),
          child: const Text('Cancel'),
        ),
        ElevatedButton(
          onPressed: isSubmitting ? null : createRoster,
          child: isSubmitting
              ? const SizedBox(
                  width: 20,
                  height: 20,
                  child: CircularProgressIndicator(strokeWidth: 2),
                )
              : const Text('Create'),
        ),
      ],
    );
  }
}
