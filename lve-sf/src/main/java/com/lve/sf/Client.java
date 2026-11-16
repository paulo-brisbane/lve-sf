package com.lve.sf;

import java.time.Instant;

import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;

import org.hibernate.annotations.Generated;
import org.hibernate.generator.EventType;


@Entity
@Table(name = "client")
public class Client {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "client_id", nullable = false, updatable = false)
	private Integer clientId;

	@JdbcTypeCode(SqlTypes.CHAR)
	@Column(name = "client_ref", length = 9, nullable = false, updatable = false)
	private String clientRef;
	
	@Column(name = "nickname", length = 30)
	private String nickname;
	
	@Generated(event = EventType.INSERT)
	@Column(name = "created_at", nullable = false, insertable = false, updatable = false)
	private Instant createdAt;

	@Generated(event = EventType.INSERT)
	@Column(name = "updated_at", nullable = false, insertable = false, updatable = false)
	private Instant updatedAt;

	protected Client() {
	    // exigido pelo JPA
	}

	protected Client(String clientRef) {
		this.clientRef = clientRef;
	}

	public Integer getClientId() {
		return clientId;
	}


	public String getClientRef() {
		return clientRef;
	}
	
	public String getNickname() {
		return nickname;
	}
	
	public void setNickname(String nickname) {
		this.nickname = nickname;
	}	

	public Instant getCreatedAt() {
		return createdAt;
	}

	public Instant getUpdatedAt() {
		return updatedAt;
	}	

}
