package com.lve.sf;

import java.time.Instant;

public record ClientResponse(String clientRef, String nickname, Instant createdAt, Instant updatedAt) {

    public static ClientResponse from(Client client) {
        return new ClientResponse(
                client.getClientRef(),
                client.getNickname(),
                client.getCreatedAt(),
                client.getUpdatedAt());
    }
}