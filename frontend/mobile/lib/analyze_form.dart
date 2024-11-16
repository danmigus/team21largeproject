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
  List<Map<String, dynamic>> tradingPlayers = [];
  List<Map<String, dynamic>> receivingPlayers = [];
  double tradingEcr = 0.0;
  double receivingEcr = 0.0;
  int currentPage = 0;
  bool isLoadingMore = false;
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

  Future<void> searchPlayers({bool loadMore = false}) async {
    if (isLoadingMore) return;
    setState(() {
      isLoadingMore = true;
    });

    try {
      if (!loadMore) {
        searchResults.clear(); // Clear results for a new search
        currentPage = 0; // Reset to the first page
      }

      final response = await http.post(
        Uri.parse(buildPath("api/searchplayer")),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'playerName': playerName,
          'position': selectedPosition != null && selectedPosition != 'None' ? selectedPosition : '',
          'team': selectedNfcTeam != null && selectedNfcTeam != 'None'
              ? selectedNfcTeam
              : selectedAfcTeam != null && selectedAfcTeam != 'None'
                  ? selectedAfcTeam
                  : '',
          'pageIndex': currentPage,
          'resultsPerPage': 12,
        }),
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        setState(() {
          searchResults.addAll(List<Map<String, dynamic>>.from(data['players']));
          currentPage++; // Increment the page index for the next fetch
        });
      } else {
        print('Failed to load players. Status code: ${response.statusCode}');
      }
    } catch (error) {
      print('Error fetching players: $error');
    } finally {
      setState(() {
        isLoadingMore = false;
      });
    }
  }

  String buildPath(String route) {
    return 'https://galaxycollapse.com/$route';
  }

  void addPlayerToTrade(Map<String, dynamic> player, bool isTrading) {
    setState(() {
      if (isTrading) {
        tradingPlayers.add(player);
        tradingEcr += calculateEcr(player['rank_ecr']);
      } else {
        receivingPlayers.add(player);
        receivingEcr += calculateEcr(player['rank_ecr']);
      }
    });
  }

  double calculateEcr(int rankEcr) {
    return 15 - ((rankEcr - 1) * 0.05);
  }

  void showSearchDialog() {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return StatefulBuilder(
          builder: (context, setState) {
            return AlertDialog(
              title: const Text('Search Players'),
              content: SingleChildScrollView(
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    TextField(
                      decoration: const InputDecoration(
                        labelText: 'Enter player name',
                      ),
                      onChanged: (text) {
                        setState(() {
                          playerName = text;
                        });
                      },
                    ),
                    DropdownButton<String>(
                      hint: const Text("Select NFC Team"),
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
                      hint: const Text("Select AFC Team"),
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
                      hint: const Text("Select Position"),
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
                      onPressed: () async {
                        await searchPlayers();
                        setState(() {});
                      },
                      child: const Text('Search'),
                    ),
                    ...searchResults.map((player) {
                      return ListTile(
                        title: Text(player['player_name']),
                        subtitle: Text(
                            '${player['player_team_id']} - ${player['player_position_id']}'),
                        trailing: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            IconButton(
                              icon: const Icon(Icons.arrow_upward),
                              onPressed: () {
                                addPlayerToTrade(player, true);
                                Navigator.pop(context); // Close dialog
                              },
                            ),
                            IconButton(
                              icon: const Icon(Icons.arrow_downward),
                              onPressed: () {
                                addPlayerToTrade(player, false);
                                Navigator.pop(context); // Close dialog
                              },
                            ),
                          ],
                        ),
                      );
                    }).toList(),
                    if (isLoadingMore)
                      const Center(child: CircularProgressIndicator()),
                    if (!isLoadingMore && searchResults.isNotEmpty)
                      ElevatedButton(
                        onPressed: () => searchPlayers(loadMore: true),
                        child: const Text('Load More'),
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
          },
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Expanded(
          child: Row(
            children: [
              Expanded(
                child: Column(
                  children: [
                    const Text('Trading'),
                    Expanded(
                      child: ListView.builder(
                        itemCount: tradingPlayers.length,
                        itemBuilder: (context, index) {
                          final player = tradingPlayers[index];
                          return ListTile(
                            title: Text(player['player_name']),
                            subtitle:
                                Text('${player['player_team_id']} - ${player['player_position_id']}'),
                          );
                        },
                      ),
                    ),
                  ],
                ),
              ),
              Expanded(
                child: Column(
                  children: [
                    const Text('Receiving'),
                    Expanded(
                      child: ListView.builder(
                        itemCount: receivingPlayers.length,
                        itemBuilder: (context, index) {
                          final player = receivingPlayers[index];
                          return ListTile(
                            title: Text(player['player_name']),
                            subtitle:
                                Text('${player['player_team_id']} - ${player['player_position_id']}'),
                          );
                        },
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
        ElevatedButton(
          onPressed: showSearchDialog,
          child: const Text('Search Players'),
        ),
        Text(
          'Net Value: ${(receivingEcr - tradingEcr).toStringAsFixed(2)}',
          style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
        ),
      ],
    );
  }
}
