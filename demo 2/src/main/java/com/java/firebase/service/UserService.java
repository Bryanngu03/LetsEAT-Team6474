package com.java.firebase.service;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.concurrent.ExecutionException;

import org.springframework.stereotype.Service;

import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.QueryDocumentSnapshot;
import com.google.cloud.firestore.QuerySnapshot;
import com.google.cloud.firestore.WriteResult;
import com.google.firebase.cloud.FirestoreClient;
import com.java.firebase.entity.User;

@Service
public class UserService {

	public String createUser(User user) throws ExecutionException, InterruptedException {

		Firestore dbFirestore = FirestoreClient.getFirestore();
		ApiFuture<WriteResult> collectionApiFuture = dbFirestore.collection("users").document(user.getId()).set(user);

		return collectionApiFuture.get().getUpdateTime().toString();
	}

	// Get data by id

	public User getUser(String id) throws InterruptedException, ExecutionException {

		Firestore dbFirestore = FirestoreClient.getFirestore();
		DocumentReference documentReference = dbFirestore.collection("users").document(id);
		ApiFuture<DocumentSnapshot> future = documentReference.get();
		DocumentSnapshot document = future.get();
		User user;
		if (document.exists()) {
			user = document.toObject(User.class);
			return user;
		}
		return null;
	}

	// Get data by Name
	public User getByName(String name) throws InterruptedException, ExecutionException {

		Firestore dbFirestore = FirestoreClient.getFirestore();
		ApiFuture<QuerySnapshot> future = dbFirestore.collection("users").whereEqualTo("name", name).get();
		List<QueryDocumentSnapshot> documents = future.get().getDocuments();

		User user1 = null;
		for (DocumentSnapshot document1 : documents) {

			if (document1.exists()) {
				user1 = document1.toObject(User.class);
			}
		}
		return user1;
	}

	// Get data by role
	public User getByRole(String role) throws InterruptedException, ExecutionException {

		Firestore dbFirestore = FirestoreClient.getFirestore();
		ApiFuture<QuerySnapshot> future = dbFirestore.collection("users").whereEqualTo("role", role).get();
		List<QueryDocumentSnapshot> documents = future.get().getDocuments();

		User user = null;
		for (DocumentSnapshot document : documents) {

			if (document.exists()) {
				user = document.toObject(User.class);
				System.err.println(user);
			}
		}
		return user;
	}

	public String updateUser(User user) throws InterruptedException, ExecutionException {
		Firestore dbFirestore = FirestoreClient.getFirestore();
		ApiFuture<WriteResult> collectionApiFuture = dbFirestore.collection("users").document(user.getId()).set(user);

		return collectionApiFuture.get().getUpdateTime().toString();
	}

	public String deleteUser(String id) {
		Firestore dbFirestore = FirestoreClient.getFirestore();
		ApiFuture<WriteResult> documentReference = dbFirestore.collection("users").document(id).delete();
		return "Succesfully deleted: " + id;
	}

	// Get All Users
	public List<User> getAllUsers() throws Exception, ExecutionException {

		Firestore dbFirestore = FirestoreClient.getFirestore();
		Iterable<DocumentReference> documentReference = dbFirestore.collection("users").listDocuments();
		Iterator<DocumentReference> iterator = documentReference.iterator();
		List<User> userList = new ArrayList<>();

		User user = null;
		while (iterator.hasNext()) {
			DocumentReference documentReference1 = iterator.next();
			ApiFuture<DocumentSnapshot> future = documentReference1.get();
			DocumentSnapshot document = future.get();

			user = document.toObject(User.class);
			userList.add(user);
		}
		return userList;
	}
}
