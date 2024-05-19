package com.java.firebase.controller;

import java.util.List;
import java.util.concurrent.ExecutionException;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.java.firebase.entity.User;
import com.java.firebase.service.UserService;

@RestController
public class UserController {

	@Autowired
	public UserService userService;

	@PostMapping("/create")
	public String createUser(@RequestBody User user) throws ExecutionException, InterruptedException {

		return userService.createUser(user);
	}

	@GetMapping("/getid")
	public User getUser(@RequestParam String id) throws InterruptedException, ExecutionException {

		return userService.getUser(id);
	}

	@GetMapping("/getname")
	public User getByName(@RequestParam String name) throws ExecutionException, Exception {

		return userService.getByName(name);
	}

	@GetMapping("/getrole")
	public User getByProfession(@RequestParam String role) throws InterruptedException, ExecutionException {

		return userService.getByRole(role);
	}

	@PutMapping("/update/{id}")
	public String updateUser(@RequestBody User user, @PathVariable String id)
			throws InterruptedException, ExecutionException {

		return userService.updateUser(user);
	}

	@DeleteMapping("/delete")
	public String deleteUser(@RequestParam String id) {

		return userService.deleteUser(id);
	}
	
	@GetMapping("/getall")
	public List<User> getAllUsers() throws Exception, ExecutionException {
		
		return userService.getAllUsers();
	}
}
