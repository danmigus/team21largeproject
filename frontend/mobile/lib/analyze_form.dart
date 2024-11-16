import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

class AnalyzeForm extends StatefulWidget {
  final Map<String, dynamic> user;

  AnalyzeForm({required this.user});

  @override
  _AnalyzeFormState createState() => _AnalyzeFormState();
}

class _AnalyzeFormState extends State<AnalyzeForm> {
  // Controllers and State Variables
  String playerName = '';
  String? selectedNfcTeam;
  String? selectedAfcTeam;
  String? selectedPosition;
  List<Map<String, dynamic>> searchResults = [];

  final List<String> nfcTeams = [
    'None', 'ARI', 'ATL', 'CAR', 'CHI', 'DAL', 'DET', 'GB', 'LAR', 'MIN', 'NO', 'NYG', 'PHI', 'SF', 'SEA', 'TB', 'WAS'
  ];

  final List<String> afcTeams = [
    'None', 'BAL', 'BUF', 'CIN', 'CLE', 'DEN', 'HOU', 'IND', 'JAC', 'KC', 'LV', 'LAC', 'MIA', 'NE', 'NYJ', 'PIT', 'TEN'
  ];

  final List<String> positions = ['None', 'QB', 'WR', 'RB', 'TE'];

  Future<void> searchPlayers() async {
    if (playerName.isEmpty &&
        (selectedNfcTeam == null || selectedNfcTeam == 'None') &&
        (selectedAfcTeam == null || selectedAfcTeam == 'None') &&
        (selectedPosition == null || selectedPosition == 'None')) {
      // Show error dialog if no filters or player name is provided
      showDialog(
        context: context,
        builder: (context) => AlertDialog(
          title: Text('Input Error'),
          content: Text('Please provide a player name or select a filter.'),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(context),
              child: Text('OK'),
            ),
          ],
        ),
      );
      return;
    }

    try {
      final response = await http.post(
        Uri.parse(buildPath("api/searchplayer")),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'playerName': playerName,
          'position': selectedPosition != 'None' ? selectedPosition : '',
          'team': selectedNfcTeam != 'None'
              ? selectedNfcTeam
              : selectedAfcTeam != 'None'
                  ? selectedAfcTeam
                  : '',
        }),
      );

      final data = jsonDecode(response.body);
      setState(() {
        searchResults = List<Map<String, dynamic>>.from(data['players']);
      });
    } catch (error) {
      print('Error searching players: $error');
    }
  }

  String buildPath(String route) {
    return 'https://galaxycollapse.com/$route';
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        TextField(
          decoration: InputDecoration(
            labelText: 'Enter player name',
          ),
          onChanged: (text) {
            setState(() {
              playerName = text;
            });
          },
        ),
        DropdownButton<String>(
          hint: Text("Select NFC Team"),
          value: selectedNfcTeam,
          items: nfcTeams.map((team) {
            return DropdownMenuItem(value: team, child: Text(team));
          }).toList(),
          onChanged: (value) {
            setState(() {
              selectedNfcTeam = value != 'None' ? value : null;
              selectedAfcTeam = null; // Reset AFC selection
            });
          },
        ),
        DropdownButton<String>(
          hint: Text("Select AFC Team"),
          value: selectedAfcTeam,
          items: afcTeams.map((team) {
            return DropdownMenuItem(value: team, child: Text(team));
          }).toList(),
          onChanged: (value) {
            setState(() {
              selectedAfcTeam = value != 'None' ? value : null;
              selectedNfcTeam = null; // Reset NFC selection
            });
          },
        ),
        DropdownButton<String>(
          hint: Text("Select Position"),
          value: selectedPosition,
          items: positions.map((pos) {
            return DropdownMenuItem(value: pos, child: Text(pos));
          }).toList(),
          onChanged: (value) {
            setState(() {
              selectedPosition = value != 'None' ? value : null;
            });
          },
        ),
        ElevatedButton(
          onPressed: searchPlayers,
          child: Text('Submit'),
        ),
        Expanded(
          child: ListView.builder(
            itemCount: searchResults.length,
            itemBuilder: (context, index) {
              final player = searchResults[index];
              return ListTile(
                title: Text(player['player_name']),
                subtitle: Text('${player['player_team_id']} - ${player['player_position_id']}'),
              );
            },
          ),
        ),
      ],
    );
  }
}




