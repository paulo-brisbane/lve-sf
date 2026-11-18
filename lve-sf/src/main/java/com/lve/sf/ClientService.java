package com.lve.sf;

import java.security.SecureRandom;
import java.util.NoSuchElementException;
import java.util.Optional;
import java.util.Set;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ClientService {

	private static final int MAX_NUMBER_ATTEMPTS = 100;
	private static final int MIN_NICKNAME_LENGTH = 2;
	private static final int MAX_NICKNAME_LENGTH = 30;
	private static final String LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	private static final String DIGITS = "0123456789";
	private static final Set<String> SUPPORTED_LANGUAGES = Set.of("en-GB", "pt-BR", "es-AR");
	private static final Set<String> SUPPORTED_COLOURS = Set.of(
			"red", "red-violet", "violet", "blue-violet", "blue", "blue-green",
			"green", "yellow-green", "yellow", "yellow-orange", "orange", "orange-red");

	private final ClientRepository clientRepository;
	private final SecureRandom random = new SecureRandom();

	public ClientService(ClientRepository clientRepository) {
		this.clientRepository = clientRepository;
	}

	@Transactional
	public Client register(String nickname) {
		String cleanNickname = validateNickname(nickname);
		String clientRef = randomClientRef();

		Client client = new Client(clientRef);
		client.setNickname(cleanNickname);
		return clientRepository.save(client);
	}

	@Transactional(readOnly = true)
	public Optional<Client> signIn(String clientRef) {
		if (clientRef == null || !clientRef.matches("[A-Z]{4}-\\d{4}")) {
			return Optional.empty();
		}
		return clientRepository.findByClientRef(clientRef);
	}

	@Transactional(readOnly = true)
	public Optional<Client> findById(Integer clientId) {
		return clientRepository.findById(clientId);
	}

	@Transactional
	public Client updateLanguage(String clientRef, String language) {
		if (language == null || !SUPPORTED_LANGUAGES.contains(language)) {
			throw new IllegalArgumentException("Unsupported language: " + language);
		}
		Client client = clientRepository.findByClientRef(clientRef)
				.orElseThrow(() -> new NoSuchElementException("Client not found"));
		client.setLanguage(language);
		return clientRepository.save(client);
	}

	@Transactional
	public Client updateColour(String clientRef, String colour) {
		if (colour == null || !SUPPORTED_COLOURS.contains(colour)) {
			throw new IllegalArgumentException("Unsupported colour: " + colour);
		}
		Client client = clientRepository.findByClientRef(clientRef)
				.orElseThrow(() -> new NoSuchElementException("Client not found"));
		client.setColour(colour);
		return clientRepository.save(client);
	}

	private String validateNickname(String nickname) {
		if (nickname == null) {
			throw new IllegalArgumentException("Nickname is required");
		}
		String trimmed = nickname.trim();
		if (trimmed.length() < MIN_NICKNAME_LENGTH || trimmed.length() > MAX_NICKNAME_LENGTH) {
			throw new IllegalArgumentException(
					"Nickname must have between " + MIN_NICKNAME_LENGTH + " and " + MAX_NICKNAME_LENGTH + " characters");
		}
		return trimmed;
	}

	private String randomClientRef() {
		StringBuilder sb = new StringBuilder(9);
		for (int i = 0; i < 4; i++) {
			sb.append(LETTERS.charAt(random.nextInt(LETTERS.length())));
		}
		sb.append('-');
		for (int i = 0; i < 4; i++) {
			sb.append(DIGITS.charAt(random.nextInt(DIGITS.length())));
		}
		return sb.toString();
	}
}
