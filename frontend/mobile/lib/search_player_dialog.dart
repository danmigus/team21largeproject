import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

class SearchPlayerDialog extends StatefulWidget {
  final String userId;
  final Function(String playerId) onSelectPlayer;

  const SearchPlayerDialog({super.key, required this.userId, required this.onSelectPlayer});

  @override
  _SearchPlayerDialogState createState() => _SearchPlayerDialogState();
}

class _SearchPlayerDialogState extends State<SearchPlayerDialog> {
  String playerName = '';
  List<Map<String, dynamic>> searchResults = [];
  bool isLoading = false;
  String error = '';

  Future<void> searchPlayers() async {
    setState(() {
      isLoading = true;
      error = '';
    });

    try {
      final response = await http.post(
        Uri.parse('https://galaxycollapse.com/api/searchplayer'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({'playerName': playerName}),
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        if (data['error'] == '') {
          setState(() {
            searchResults = List<Map<String, dynamic>>.from(data['players']);
          });
        } else {
          setState(() {
            error = data['error'];
          });
        }
      } else {
        setState(() {
          error = 'Failed to fetch players.';
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

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      title: const Text('Search Players'),
      content: SizedBox(
        width: MediaQuery.of(context).size.width * 0.9, // 90% of the screen width
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            TextField(
              decoration: const InputDecoration(labelText: 'Player Name'),
              onChanged: (value) {
                playerName = value;
              },
            ),
            ElevatedButton(
              onPressed: searchPlayers,
              child: const Text('Search'),
            ),
            if (isLoading)
              const CircularProgressIndicator()
            else if (error.isNotEmpty)
              Text('Error: $error')
            else if (searchResults.isNotEmpty)
              Flexible(
                child: ListView.builder(
                  shrinkWrap: true,
                  itemCount: searchResults.length,
                  itemBuilder: (context, index) {
                    final player = searchResults[index];
                    return ListTile(
                      title: Text(player['player_name']),
                      subtitle: Text('${player['player_team_id']} - ${player['player_position_id']}'),
                      onTap: () => widget.onSelectPlayer(player['_id']),
                    );
                  },
                ),
              ),
          ],
        ),
      ),
      actions: [
        TextButton(
          onPressed: () => Navigator.pop(context),
          child: const Text('Close'),
        ),
      ],
    );
  }
}
