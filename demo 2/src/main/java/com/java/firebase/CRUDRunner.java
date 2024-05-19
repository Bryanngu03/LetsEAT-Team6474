package com.java.firebase;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;

@SpringBootApplication
public class CRUDRunner {

	public static void main(String[] args) throws IOException {

        String serviceAccountFilePath = "/Users/bryan03/Downloads/firebase-crud-application-master copy/src/main/resources/serviceAccountKey.json";

        File file = new File(serviceAccountFilePath);

        // Import From FireBase..
        FileInputStream serviceAccount = new FileInputStream(file.getAbsolutePath());


		FirebaseOptions options = new FirebaseOptions.Builder()
				.setCredentials(GoogleCredentials.fromStream(serviceAccount))
				.setDatabaseUrl("https://letseat-38d96-default-rtdb.firebaseio.com")
				.build();

		FirebaseApp.initializeApp(options);

		SpringApplication.run(CRUDRunner.class, args);
	}

}
