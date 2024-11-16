import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

class AnalyzeForm extends StatefulWidget {
  final Map<String, dynamic> user;

  

  const AnalyzeForm({super.key, required this.user});

  @override
  _AnalyzeFormState createState() => _AnalyzeFormState();
}

class _AnalyzeFormState extends State<AnalyzeForm> {
  // Controllers and State Variables
  String playerName = '';
  String position = '';
  String team = '';
  double searchEcr = 0.0;
  double rosterEcr = 0.0;
  List<Map<String, dynamic>> searchResults = [];
  List<Map<String, dynamic>> rosters = [];
  List<String> searchPlayersArray = [];
  List<String> rosterPlayersArray = [];

  String buildPath(String route) {
    return 'https://galaxycollapse.com/$route';
  }

  final List<String> nfcTeams = [
    'ARI', 'ATL', 'CAR', 'CHI', 'DAL', 'DET', 'GB', 'LAR', 'MIN', 'NO', 'NYG', 'PHI', 'SF', 'SEA', 'TB', 'WAS'
  ];

  final List<String> afcTeams = [
    'BAL', 'BUF', 'CIN', 'CLE', 'DEN', 'HOU', 'IND', 'JAC', 'KC', 'LV', 'LAC', 'MIA', 'NE', 'NYJ', 'PIT', 'TEN'
  ];

  @override
  void initState() {
    super.initState();
    loadRosters();
  }

  Future<void> loadRosters() async {
    try {
      final response = await http.post(
        Uri.parse(buildPath("api/getrosters")),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({'userId': widget.user['id']}),
      );

      final data = jsonDecode(response.body);
      setState(() {
        rosters = List<Map<String, dynamic>>.from(data['rosters']);
      });
    } catch (error) {
      print('Error loading rosters: $error');
    }
  }

  Future<void> searchPlayers() async {
    try {
      final response = await http.post(
        Uri.parse(buildPath("api/searchplayer")),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'playerName': playerName,
          'position': position,
          'team': team,
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

  void handleSearchEcr(double ecr) {
    setState(() {
      searchEcr = ecr;
    });
  }

  void handleRosterEcr(double ecr) {
    setState(() {
      rosterEcr = ecr;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Text('Net Value: ${(searchEcr - rosterEcr).toStringAsFixed(2)}'),
        TextField(
          decoration: const InputDecoration(labelText: 'Enter player name'),
          onChanged: (text) {
            setState(() {
              playerName = text;
            });
          },
        ),
        DropdownButton<String>(
          hint: const Text("Select NFC Team"),
          items: nfcTeams.map((team) {
            return DropdownMenuItem(value: team, child: Text(team));
          }).toList(),
          onChanged: (value) {
            setState(() {
              team = value ?? '';
            });
          },
        ),
        DropdownButton<String>(
          hint: const Text("Select AFC Team"),
          items: afcTeams.map((team) {
            return DropdownMenuItem(value: team, child: Text(team));
          }).toList(),
          onChanged: (value) {
            setState(() {
              team = value ?? '';
            });
          },
        ),
        DropdownButton<String>(
          hint: const Text("Select Position"),
          items: ['QB', 'WR', 'RB', 'TE'].map((position) {
            return DropdownMenuItem(value: position, child: Text(position));
          }).toList(),
          onChanged: (value) {
            setState(() {
              position = value ?? '';
            });
          },
        ),
        ElevatedButton(
          onPressed: searchPlayers,
          child: const Text('Submit'),
        ),
        ListView.builder(
          shrinkWrap: true,
          itemCount: searchResults.length,
          itemBuilder: (context, index) {
            final player = searchResults[index];
            return ListTile(
              title: Text(player['player_name']),
              subtitle: Text('${player['player_team_id']} - ${player['player_position_id']}'),
            );
          },
        ),
      ],
    );
  }
}
