import 'package:flutter/material.dart';
import 'dart:convert';
import 'package:http/http.dart' as http;
import 'search_player_dialog.dart';

class RosterBuilderForm extends StatefulWidget {
  final String userId;

  const RosterBuilderForm({super.key, required this.userId});

  @override
  _RosterBuilderFormState createState() => _RosterBuilderFormState();
}

class _RosterBuilderFormState extends State<RosterBuilderForm> {
  List<Map<String, dynamic>> rosters = [];
  bool isLoading = true;
  String error = '';

  @override
  void initState() {
    super.initState();
    fetchRosters();
  }

  Future<void> fetchRosters() async {
    setState(() {
      isLoading = true;
      error = '';
    });

    try {
      final response = await http.post(
        Uri.parse('https://galaxycollapse.com/api/getrosters'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({'userId': widget.userId}),
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        if (data['error'] == '') {
          setState(() {
            rosters = List<Map<String, dynamic>>.from(data['rosters']);
          });
        } else {
          setState(() {
            error = data['error'];
          });
        }
      } else {
        setState(() {
          error = 'Failed to fetch rosters.';
        });
      }
    } catch (e) {
      setState(() {
        error = e.toString();
      });
    } finally {
      setState(() {
        isLoading = false;
      });
    }
  }

  Future<void> addPlayerToRoster(String rosterId, String playerId) async {
    try {
      final response = await http.post(
        Uri.parse('https://galaxycollapse.com/api/addtoroster'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({'userId': widget.userId, 'rosterId': rosterId, 'playerId': playerId}),
      );

      final data = jsonDecode(response.body);
      if (data['error'] != '') {
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Error: ${data['error']}')));
      } else {
        ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Player added successfully!')));
        await fetchRosters(); // Refresh rosters
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Error: $e')));
    }
  }

  void showSearchPlayerDialog(String rosterId) {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return SearchPlayerDialog(
          userId: widget.userId,
          onSelectPlayer: (String playerId) {
            Navigator.pop(context); // Close dialog
            addPlayerToRoster(rosterId, playerId);
          },
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return isLoading
        ? const Center(child: CircularProgressIndicator())
        : error.isNotEmpty
            ? Center(child: Text('Error: $error'))
            : ListView.builder(
                itemCount: rosters.length,
                itemBuilder: (context, index) {
                  final roster = rosters[index];
                  return Card(
                    child: ExpansionTile(
                      title: Text(roster['RosterName']),
                      children: [
                        for (var player in roster['players'])
                          ListTile(
                            title: Text(player['player_name']),
                            subtitle: Text('${player['player_team_id']} - ${player['player_position_id']}'),
                          ),
                        IconButton(
                          icon: const Icon(Icons.add),
                          onPressed: () => showSearchPlayerDialog(roster['RosterId']),
                        ),
                      ],
                    ),
                  );
                },
              );
  }
}
