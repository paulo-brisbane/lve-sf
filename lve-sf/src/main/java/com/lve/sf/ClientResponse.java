package com.lve.sf;

import java.time.Instant;

public record ClientResponse(
		String clientRef,
		String nickname,
		String language,
		String colour,
		Instant createdAt,
		Instant updatedAt) {

	public static ClientResponse from(Client client) {
		return new ClientResponse(
				client.getClientRef(),
				client.getNickname(),
				client.getLanguage(),
				client.getColour(),
				client.getCreatedAt(),
				client.getUpdatedAt());
	}
}
