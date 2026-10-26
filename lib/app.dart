import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'screens/home_screen.dart';

class VivekVideoStudioApp extends StatelessWidget {
  const VivekVideoStudioApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Vivek AI Video Studio',
      debugShowCheckedModeBanner: false,
      themeMode: ThemeMode.dark,
      theme: ThemeData(
        useMaterial3: true,
        brightness: Brightness.dark,
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF6366F1), // Indigo violet accent
          primary: const Color(0xFF6366F1),
          secondary: const Color(0xFF38BDF8), // Cyan blue accent
          surface: const Color(0xFF0B0F19),
          background: const Color(0xFF030712),
          brightness: Brightness.dark,
        ),
        scaffoldBackgroundColor: const Color(0xFF030712),
        textTheme: GoogleFonts.plusJakartaSansTextTheme(ThemeData.dark().textTheme),
        appBarTheme: const AppBarTheme(
          backgroundColor: Color(0xFF0B0F19),
          elevation: 0,
          centerTitle: false,
        ),
      ),
      home: const HomeScreen(),
    );
  }
}
