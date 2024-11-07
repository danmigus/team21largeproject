import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:flutter_hooks/flutter_hooks.dart';

class AnalyzePage extends HookWidget {
  @override
  Widget build(BuildContext context) {
    // Local storage handling
    final userData = jsonDecode(localStorage.getItem('user_data') ?? '{}');
    final userFirstName = userData['firstName'] ?? '';
    final userLastName = userData['lastName'] ?? '';

    // State variables (equivalent to useState in React)
    final message = useState('');
    final playerName = useState('');
    final position = useState('');
    final team = useState('');
    final playerCards = useState<List<String>>([]);
    final ecr = useState('');
    final searchResults = useState<List<Map<String, dynamic>>>([]);

    final appName = 'galaxycollapse.com';

    String buildPath(String route) {
      if (bool.fromEnvironment('dart.vm.product')) {
        return 'https://$appName/$route';
      } else {
        return 'http://localhost:5000/$route';
      }
    }

    void handleSearchText(String value) {
      playerName.value = value;
    }

    void handleSearchPosition(String value) {
      position.value = value;
    }

    void handleSearchTeam(String value) {
      team.value = value;
    }

    void handleEcr(String newEcr) {
      ecr.value = newEcr;
    }

    Future<void> doLogout() async {
      message.value = "Logging out...";
      localStorage.clear();
      Navigator.pushReplacementNamed(context, '/');
    }

    Future<void> searchPlayers() async {
      final revealResults = context.findAncestorRenderObjectOfType<RenderBox>();
      revealResults?.style?.setDisplay('block');

      final obj = {
        'playerName': playerName.value,
        'position': position.value,
        'team': team.value,
      };
      final js = jsonEncode(obj);

      try {
        message.value = "Searching... 🤔";
        final response = await http.post(
          Uri.parse(buildPath("api/searchplayer")),
          headers: {'Content-Type': 'application/json'},
          body: js,
        );

        final res = jsonDecode(response.body);
        message.value = "Search completed 🤓";
        await Future.delayed(Duration(seconds: 2));
        message.value = '';
        searchResults.value = List<Map<String, dynamic>>.from(res['players']);
      } catch (error) {
        message.value = '❌ Search went wrong...';
        showDialog(
          context: context,
          builder: (_) => AlertDialog(
            title: Text("Error"),
            content: Text(error.toString()),
            actions: <Widget>[
              TextButton(
                onPressed: () => Navigator.pop(context),
                child: Text("OK"),
              ),
            ],
          ),
        );
      }
    }

    return Scaffold(
      appBar: AppBar(
        title: Text('Welcome, $userFirstName $userLastName 👋😃'),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            ElevatedButton(
              onPressed: doLogout,
              child: Text("Logout"),
            ),
            SizedBox(height: 16),
            Text(message.value),
            SizedBox(height: 16),
            Column(
              children: [
                Text("Search: "),
                TextField(
                  onChanged: handleSearchText,
                  decoration: InputDecoration(hintText: 'Enter player name'),
                ),
                DropdownButton<String>(
                  value: position.value.isNotEmpty ? position.value : null,
                  hint: Text('Position'),
                  items: ['QB', 'WR', 'RB', 'TE']
                      .map((String value) => DropdownMenuItem<String>(
                            value: value,
                            child: Text(value),
                          ))
                      .toList(),
                  onChanged: (value) {
                    handleSearchPosition(value ?? '');
                  },
                ),
                TextField(
                  onChanged: handleSearchTeam,
                  decoration: InputDecoration(hintText: 'Team'),
                ),
                ElevatedButton(
                  onPressed: searchPlayers,
                  child: Text("Submit"),
                ),
                if (searchResults.value.isNotEmpty)
                  Expanded(
                    child: ListView.builder(
                      itemCount: searchResults.value.length,
                      itemBuilder: (context, index) {
                        final player = searchResults.value[index];
                        return ListTile(
                          title: Text(player['player_name']),
                          subtitle: Text(
                              '[${player['player_position_id']}, ${player['player_team_id']}]'),
                          leading: Image.network(player['player_image_url']),
                          onTap: () {
                            final card = jsonEncode(player);
                            playerCards.value.add(card);
                          },
                        );
                      },
                    ),
                  ),
              ],
            ),
            SizedBox(height: 16),
            Text("Total ECR: ${ecr.value}"),
            SizedBox(height: 16),
            DragTarget<String>(
              onAccept: (card) {
                final newEcr = (15 - ((jsonDecode(card)['rank_ecr'] - 1) * 0.05)) +
                    double.parse(ecr.value);
                handleEcr(newEcr.toStringAsFixed(2));
                playerCards.value.add(card);
              },
              builder: (context, candidateData, rejectedData) {
                return Container(
                  color: Colors.grey[300],
                  width: double.infinity,
                  height: 200,
                  child: ListView(
                    children: playerCards.value
                        .map((card) {
                          final player = jsonDecode(card);
                          return ListTile(
                            title: Text(player['player_name']),
                            subtitle: Text(
                                '[${player['player_position_id']}, ${player['player_team_id']}]'),
                            leading: Image.network(player['player_image_url']),
                          );
                        })
                        .toList(),
                  ),
                );
              },
            ),
          ],
        ),
      ),
    );
  }
}