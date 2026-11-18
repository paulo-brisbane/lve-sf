package com.lve.sf;

import java.util.Map;
import java.util.NoSuchElementException;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/api/clients")
public class ClientController {

	private static final String SESSION_CLIENT_REF = "clientRef";

	private final ClientService clientService;

	public ClientController(ClientService clientService) {
		this.clientService = clientService;
	}

	// Request bodies

	public record NicknameRequest(String nickname) {}

	public record SignInRequest(String clientRef) {}

	public record LanguageRequest(String language) {}

	public record SettingsRequest(String avatar, String language, String theme) {}

	// Endpoints

	@PostMapping
	public ResponseEntity<ClientResponse> register(@RequestBody NicknameRequest request) {
		Client client = clientService.register(request.nickname());
		return ResponseEntity.status(HttpStatus.CREATED).body(ClientResponse.from(client));
	}

	@PostMapping("/sign-in")
	public ResponseEntity<ClientResponse> signIn(@RequestBody SignInRequest request,
	                                             HttpServletRequest httpRequest) {
		return clientService.signIn(request.clientRef())
				.<ResponseEntity<ClientResponse>>map(client -> {
					HttpSession session = httpRequest.getSession(true);
					httpRequest.changeSessionId();
					session.setAttribute(SESSION_CLIENT_REF, client.getClientRef());
					return ResponseEntity.ok(ClientResponse.from(client));
				})
				.orElseGet(() -> ResponseEntity.status(HttpStatus.UNAUTHORIZED).build());
	}

	@PostMapping("/sign-out")
	public ResponseEntity<Void> signOut(HttpServletRequest httpRequest) {
		HttpSession session = httpRequest.getSession(false);
		if (session != null) {
			session.invalidate();
		}
		return ResponseEntity.noContent().build();
	}

	@GetMapping("/me")
	public ResponseEntity<ClientResponse> me(HttpServletRequest httpRequest) {
		HttpSession session = httpRequest.getSession(false);
		if (session == null) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
		}

		Object clientRef = session.getAttribute(SESSION_CLIENT_REF);
		if (!(clientRef instanceof String ref)) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
		}

		return clientService.signIn(ref)
				.map(client -> ResponseEntity.ok(ClientResponse.from(client)))
				.orElseGet(() -> ResponseEntity.status(HttpStatus.UNAUTHORIZED).build());
	}

	@PutMapping("/me/language")
	public ResponseEntity<ClientResponse> updateLanguage(@RequestBody LanguageRequest request,
	                                                     HttpServletRequest httpRequest) {
		HttpSession session = httpRequest.getSession(false);
		if (session == null || !(session.getAttribute(SESSION_CLIENT_REF) instanceof String ref)) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
		}

		Client client = clientService.updateLanguage(ref, request.language());
		return ResponseEntity.ok(ClientResponse.from(client));
	}

	@GetMapping("/me/settings")
	public ResponseEntity<Map<String, String>> getSettings(HttpServletRequest httpRequest) {
		HttpSession session = httpRequest.getSession(false);
		if (session == null || !(session.getAttribute(SESSION_CLIENT_REF) instanceof String ref)) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
		}

		return clientService.signIn(ref)
				.map(client -> ResponseEntity.ok(settingsBody(client.getLanguage())))
				.orElseGet(() -> ResponseEntity.status(HttpStatus.UNAUTHORIZED).build());
	}

	@PutMapping("/me/settings")
	public ResponseEntity<Map<String, String>> updateSettings(@RequestBody SettingsRequest request,
	                                                          HttpServletRequest httpRequest) {
		HttpSession session = httpRequest.getSession(false);
		if (session == null || !(session.getAttribute(SESSION_CLIENT_REF) instanceof String ref)) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
		}

		Client client = clientService.signIn(ref)
				.orElseThrow(() -> new NoSuchElementException("Client not found"));

		if (request.language() != null) {
			client = clientService.updateLanguage(ref, request.language());
		}

		// TODO: persist avatar and theme once the Client entity has columns for them.
		return ResponseEntity.ok(settingsBody(client.getLanguage()));
	}

	private static Map<String, String> settingsBody(String language) {
		return Map.of("language", language, "avatar", "indigo", "theme", "system");
	}

	// Error mapping

	@ExceptionHandler(IllegalArgumentException.class)
	public ResponseEntity<Map<String, String>> handleBadRequest(IllegalArgumentException ex) {
		return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", ex.getMessage()));
	}

	@ExceptionHandler(NoSuchElementException.class)
	public ResponseEntity<Map<String, String>> handleNotFound(NoSuchElementException ex) {
		return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", ex.getMessage()));
	}
}
