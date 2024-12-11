import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Öğrenci CRUD',
      home: StudentScreen(),
    );
  }
}

class StudentScreen extends StatefulWidget {
  @override
  _StudentScreenState createState() => _StudentScreenState();
}

class _StudentScreenState extends State<StudentScreen> {
  List<dynamic> students = [];

  @override
  void initState() {
    super.initState();
    fetchStudents();  // Öğrencileri yükle
  }

  // Öğrencileri API'den al
  Future<void> fetchStudents() async {
    final response = await http.get(Uri.parse('http://localhost:3001/students'));
    
    if (response.statusCode == 200) {
      // JSON verisini decode et ve listeyi güncelle
      setState(() {
        students = json.decode(response.body);
      });
    } else {
      throw Exception('Öğrenciler yüklenemedi');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Öğrenciler Listesi'),
      ),
      body: students.isEmpty
          ? Center(child: CircularProgressIndicator())  
          : ListView.builder(
              itemCount: students.length,
              itemBuilder: (context, index) {
                final student = students[index];
                return ListTile(
                  title: Text(student['ad'] + ' ' + student['soyad']),
                  subtitle: Text('Bölüm ID: ' + student['bolumId'].toString()),
                );
              },
            ),
    );
  }
}
