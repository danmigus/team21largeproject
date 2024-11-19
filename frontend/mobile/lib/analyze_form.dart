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
                         backgroundColor: const Color.fromARGB(255, 255, 255, 255),
                          foregroundColor: Colors.black, // Black text
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
              actions: [
                TextButton(
                  onPressed: () => Navigator.pop(context),
                  child: const Text(
                    'Close',
                    style: TextStyle(color: Colors.white),
                  ),
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
    return Container(
      decoration: const BoxDecoration(
        gradient: LinearGradient(
          colors: [Colors.black, Colors.indigo, Colors.black],
          begin: Alignment.topRight,
          end: Alignment.bottomRight,
        ),
      ),
      child: Column(
        children: [
          Expanded(
            child: Row(
              children: [
                Expanded(
                  child: Column(
                    children: [
                      const Text(
                        'Trading',
                        style: TextStyle(fontSize: 18, color: Colors.white),
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
                                  textStyle: const TextStyle(
                                    fontSize: 18,
                                    fontWeight: FontWeight.bold,
                                  ),
                                  colors: [
                                    const Color.fromARGB(255, 21, 56, 255),
                                    Colors.cyan,
                                    Colors.lightBlueAccent,
                                  ],
                                  speed: const Duration(milliseconds: 500),
                                ),
                              ],
                              isRepeatingAnimation: false,
                            ),
                            subtitle: AnimatedTextKit(
                              animatedTexts: [
                                ColorizeAnimatedText(
                                  '${player['player_team_id']} - ${player['player_position_id']}',
                                  textStyle: const TextStyle(
                                    fontSize: 16,
                                  ),
                                  colors: [
                                    const Color.fromARGB(255, 21, 56, 255), // Blue animation for trading
                                    Colors.cyan,
                                    Colors.lightBlueAccent,
                                  ],
                                  speed: const Duration(milliseconds: 500),
                                ),
                              ],
                              isRepeatingAnimation: false,
                            ),
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
      const Text(
        'Receiving',
        style: TextStyle(fontSize: 18, color: Colors.white),
      ),
      Expanded(
        child: ListView.builder(
          itemCount: receivingPlayers.length,
          itemBuilder: (context, index) {
            final player = receivingPlayers[index];
            return ListTile(
              title: Row(
                mainAxisAlignment: MainAxisAlignment.end, // Align text to the right
                children: [
                  AnimatedTextKit(
                    animatedTexts: [
                      ColorizeAnimatedText(
                        player['player_name'],
                        textStyle: const TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                        ),
                        colors: [
                          Colors.red, // Red animation for receiving
                          const Color.fromARGB(255, 180, 0, 0),
                          const Color.fromARGB(255, 73, 0, 0),
                        ],
                        speed: const Duration(milliseconds: 500),
                      ),
                    ],
                    isRepeatingAnimation: false,
                  ),
                ],
              ),
              subtitle: Row(
                mainAxisAlignment: MainAxisAlignment.end, // Align subtitle to the right
                children: [
                  AnimatedTextKit(
                    animatedTexts: [
                      ColorizeAnimatedText(
                        '${player['player_team_id']} - ${player['player_position_id']}',
                        textStyle: const TextStyle(
                          fontSize: 16,
                        ),
                        colors: [
                          Colors.red, // Red animation for receiving
                          const Color.fromARGB(255, 180, 0, 0),
                          const Color.fromARGB(255, 73, 0, 0),
                        ],
                        speed: const Duration(milliseconds: 500),
                      ),
                    ],
                    isRepeatingAnimation: false,
                  ),
                ],
              ),
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
            style: ElevatedButton.styleFrom(
               backgroundColor: const Color.fromARGB(255, 255, 255, 255),
               foregroundColor: Colors.black, // Black text
            ),
            onPressed: showSearchDialog,
            child: const Text('Search Players'),
          ),
          AnimatedTextKit(
  animatedTexts: [
    ColorizeAnimatedText(
      'Net Value: ${(receivingEcr - tradingEcr).toStringAsFixed(2)}',
      textStyle: const TextStyle(
        fontSize: 18,
        fontWeight: FontWeight.bold,
      ),
      colors: [
        Colors.purple, // Purple color
        const Color.fromARGB(255, 0, 13, 87), // Dark blue
        const Color.fromARGB(255, 0, 47, 255), // Bright blue
        const Color.fromARGB(255, 204, 0, 255), // Pinkish-purple
        const Color.fromARGB(255, 50, 0, 129), // Deep purple
      ],
      speed: const Duration(milliseconds: 600), // Adjust speed for smooth transitions
    ),
  ],
  isRepeatingAnimation: true, // Animation will loop
  repeatForever: true, // Ensures continuous animation
),
        ],
      ),
    );
  }
}
