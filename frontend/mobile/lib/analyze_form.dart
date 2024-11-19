import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'login_page.dart';
import 'package:animated_text_kit/animated_text_kit.dart';

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
        searchResults.clear();
        currentPage = 0;
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
          currentPage++;
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

  void logout() {
    Navigator.pushAndRemoveUntil(
      context,
      MaterialPageRoute(builder: (context) => const LoginPage()),
      (route) => false,
    );
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

  void removePlayerFromTrade(int index, bool isTrading) {
    setState(() {
      if (isTrading) {
        tradingEcr -= calculateEcr(tradingPlayers[index]['rank_ecr']);
        tradingPlayers.removeAt(index);
      } else {
        receivingEcr -= calculateEcr(receivingPlayers[index]['rank_ecr']);
        receivingPlayers.removeAt(index);
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
              backgroundColor: Colors.black87,
              title: const Text(
                'Search Players',
                style: TextStyle(color: Colors.white),
              ),
              content: SingleChildScrollView(
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    TextField(
                      decoration: const InputDecoration(
                        labelText: 'Enter player name',
                        labelStyle: TextStyle(color: Colors.white70),
                        enabledBorder: UnderlineInputBorder(
                          borderSide: BorderSide(color: Colors.blueAccent),
                        ),
                        focusedBorder: UnderlineInputBorder(
                          borderSide: BorderSide(color: Colors.purpleAccent),
                        ),
                      ),
                      style: const TextStyle(color: Colors.white),
                      onChanged: (text) {
                        setState(() {
                          playerName = text;
                        });
                      },
                    ),
                    const SizedBox(height: 10),
                    DropdownButton<String>(
                      dropdownColor: Colors.black87,
                      hint: const Text(
                        "Select NFC Team",
                        style: TextStyle(color: Colors.white70),
                      ),
                      value: selectedNfcTeam,
                      items: nfcTeams.map((team) {
                        return DropdownMenuItem(
                          value: team,
                          child: Text(
                            team,
                            style: const TextStyle(color: Colors.white),
                          ),
                        );
                      }).toList(),
                      onChanged: (value) {
                        setState(() {
                          selectedNfcTeam = value != 'None' ? value : null;
                          selectedAfcTeam = null;
                        });
                      },
                    ),
                    const SizedBox(height: 10),
                    DropdownButton<String>(
                      dropdownColor: Colors.black87,
                      hint: const Text(
                        "Select AFC Team",
                        style: TextStyle(color: Colors.white70),
                      ),
                      value: selectedAfcTeam,
                      items: afcTeams.map((team) {
                        return DropdownMenuItem(
                          value: team,
                          child: Text(
                            team,
                            style: const TextStyle(color: Colors.white),
                          ),
                        );
                      }).toList(),
                      onChanged: (value) {
                        setState(() {
                          selectedAfcTeam = value != 'None' ? value : null;
                          selectedNfcTeam = null;
                        });
                      },
                    ),
                    const SizedBox(height: 10),
                    DropdownButton<String>(
                      dropdownColor: Colors.black87,
                      hint: const Text(
                        "Select Position",
                        style: TextStyle(color: Colors.white70),
                      ),
                      value: selectedPosition,
                      items: positions.map((pos) {
                        return DropdownMenuItem(
                          value: pos,
                          child: Text(
                            pos,
                            style: const TextStyle(color: Colors.white),
                          ),
                        );
                      }).toList(),
                      onChanged: (value) {
                        setState(() {
                          selectedPosition = value != 'None' ? value : null;
                        });
                      },
                    ),
                    const SizedBox(height: 10),
                    ElevatedButton(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.white,
                        foregroundColor: Colors.black,
                      ),
                      onPressed: () async {
                        await searchPlayers();
                        setState(() {});
                      },
                      child: const Text('Search'),
                    ),
                    const SizedBox(height: 10),
                    ...searchResults.map((player) {
                      return ListTile(
                        tileColor: Colors.black54,
                        title: Text(
                          player['player_name'],
                          style: const TextStyle(color: Colors.white),
                          overflow: TextOverflow.ellipsis, // Prevent overlap
                          maxLines: 1, // Ensure it doesn't take up more than one line
                        ),
                        subtitle: Text(
                          '${player['player_team_id']} - ${player['player_position_id']}',
                          style: const TextStyle(color: Colors.white70),
                        ),
                        trailing: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            IconButton(
                              icon: const Icon(Icons.arrow_upward, color: Colors.blueAccent),
                              onPressed: () {
                                addPlayerToTrade(player, true);
                                Navigator.pop(context);
                              },
                            ),
                            IconButton(
                              icon: const Icon(Icons.arrow_downward, color: Colors.redAccent),
                              onPressed: () {
                                addPlayerToTrade(player, false);
                                Navigator.pop(context);
                              },
                            ),
                          ],
                        ),
                      );
                    }).toList(),
                    if (isLoadingMore)
                      const Center(child: CircularProgressIndicator(color: Colors.purpleAccent)),
                    if (!isLoadingMore && searchResults.isNotEmpty)
                      ElevatedButton(
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Colors.blueAccent,
                        ),
                        onPressed: () => searchPlayers(loadMore: true),
                        child: const Text('Load More'),
                      ),
                  ],
                ),
              ),
            );
          },
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    // Calculate Net Trade Value
    double netTradeValue = receivingEcr - tradingEcr;

    // Determine the color based on the value
    Color netTradeValueColor = netTradeValue > 0
        ? Colors.green
        : netTradeValue < 0
            ? Colors.red
            : Colors.grey;

    return Scaffold(
      backgroundColor: Colors.black87,
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Button to show search dialog
            ElevatedButton(
              onPressed: showSearchDialog,
              child: const Text('Search for Players'),
            ),
            const SizedBox(height: 20),

            // Net Trade Value display
            Text(
              'Net Trade Value:',
              style: const TextStyle(
                fontSize: 18,
                color: Colors.white,
                fontWeight: FontWeight.bold,
              ),
            ),
            Text(
              '${netTradeValue.toStringAsFixed(2)}', // Showing the value with 2 decimal points
              style: TextStyle(
                fontSize: 18,
                color: netTradeValueColor, // Dynamic color based on value
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 20),

            // Trading Players Section
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text('Trading Players', style: const TextStyle(fontSize: 20, color: Colors.white)),
              
              ],
            ),
            Expanded(
              child: ListView.builder(
                itemCount: tradingPlayers.length,
                itemBuilder: (context, index) {
                  final player = tradingPlayers[index];
                  return ListTile(
                    title: AnimatedTextKit(
                      animatedTexts: [
                        ColorizeAnimatedText(
                          player['player_name'],
                          textStyle: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                          colors: [Colors.blue, Colors.blue, Colors.lightBlue],
                        ),
                      ],
                      isRepeatingAnimation: false,
                    ),
                    subtitle: Row(
                      mainAxisAlignment: MainAxisAlignment.start,
                      children: [
                        Expanded(
                          child: Text(
                            '${player['player_team_id']} - ${player['player_position_id']}',
                            style: const TextStyle(color: Colors.white70),
                            overflow: TextOverflow.ellipsis,
                            softWrap: true,
                          ),
                        ),
                      ],
                    ),
                    trailing: IconButton(
                      icon: const Icon(Icons.delete, color: Colors.grey),
                      onPressed: () => removePlayerFromTrade(index, true),
                    ),
                  );
                },
              ),
            ),
            const SizedBox(height: 20),

            // Receiving Players Section
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text('Receiving Players', style: const TextStyle(fontSize: 20, color: Colors.white)),
              ],
            ),
            Expanded(
              child: ListView.builder(
                itemCount: receivingPlayers.length,
                itemBuilder: (context, index) {
                  final player = receivingPlayers[index];
                  return ListTile(
                    title: AnimatedTextKit(
                      animatedTexts: [
                        ColorizeAnimatedText(
                          player['player_name'],
                          textStyle: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                          colors: [Colors.red, Colors.red, Colors.orange],
                        ),
                      ],
                      isRepeatingAnimation: false,
                    ),
                    subtitle: Row(
                      mainAxisAlignment: MainAxisAlignment.start,
                      children: [
                        Expanded(
                          child: Text(
                            '${player['player_team_id']} - ${player['player_position_id']}',
                            style: const TextStyle(color: Colors.white70),
                            overflow: TextOverflow.ellipsis,
                            softWrap: true,
                          ),
                        ),
                      ],
                    ),
                    trailing: IconButton(
                      icon: const Icon(Icons.delete, color: Colors.grey),
                      onPressed: () => removePlayerFromTrade(index, false),
                    ),
                  );
                },
              ),
            ),
          ],
        ),
      ),
    );
  }
}



