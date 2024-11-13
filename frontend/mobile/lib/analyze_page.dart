import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:flutter_hooks/flutter_hooks.dart';
import 'package:shared_preferences/shared_preferences.dart';

class AnalyzePage extends HookWidget {
  const AnalyzePage({super.key});

  Future<void> fetchUserData(ValueNotifier<Map<String, dynamic>> userData) async {
    final prefs = await SharedPreferences.getInstance();
    String? storedData = prefs.getString('user_data');
    if (storedData != null) {
      userData.value = jsonDecode(storedData);
    }
  }

  @override
  Widget build(BuildContext context) {
    final userData = useState<Map<String, dynamic>>({});
    useEffect(() {
      fetchUserData(userData);
      return null;
    }, []);

    final message = useState('');
    final playerName = useState('');
    final position = useState('');
    final team = useState('');
    final playerCards = useState<List<String>>([]);
    final ecr = useState('');
    final searchResults = useState<List<Map<String, dynamic>>>([]);

    const appName = 'galaxycollapse.com';

    String buildPath(String route) {
      if (const bool.fromEnvironment('dart.vm.product')) {
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
      final prefs = await SharedPreferences.getInstance();
      await prefs.clear();

      if (context.mounted) {  // Check if widget is still mounted
        Navigator.pushReplacementNamed(context, '/');
      }
    }

    Future<void> searchPlayers() async {
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
        await Future.delayed(const Duration(seconds: 2));
        message.value = '';
        searchResults.value = List<Map<String, dynamic>>.from(res['players']);
      } catch (error) {
        message.value = '❌ Search went wrong...';

        if (context.mounted) {  // Check if widget is still mounted
          showDialog(
            context: context,
            builder: (_) => AlertDialog(
              title: const Text("Error"),
              content: Text(error.toString()),
              actions: <Widget>[
                TextButton(
                  onPressed: () => Navigator.pop(context),
                  child: const Text("OK"),
                ),
              ],
            ),
          );
        }
      }
    }

    return Scaffold(
      appBar: AppBar(
        title: Text('Welcome, ${userData.value['firstName']} ${userData.value['lastName']} 👋😃'),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            ElevatedButton(
              onPressed: doLogout,
              child: const Text("Logout"),
            ),
            const SizedBox(height: 16),
            Text(message.value),
            const SizedBox(height: 16),
            Column(
              children: [
                const Text("Search: "),
                TextField(
                  onChanged: handleSearchText,
                  decoration: const InputDecoration(hintText: 'Enter player name'),
                ),
                DropdownButton<String>(
                  value: position.value.isNotEmpty ? position.value : null,
                  hint: const Text('Position'),
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
                  decoration: const InputDecoration(hintText: 'Team'),
                ),
                ElevatedButton(
                  onPressed: searchPlayers,
                  child: const Text("Submit"),
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
            const SizedBox(height: 16),
            Text("Total ECR: ${ecr.value}"),
            const SizedBox(height: 16),
            DragTarget<String>(
              onAcceptWithDetails: (details) {  // Correctly extract data from DragTargetDetails<String>
                final card = details.data;
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

