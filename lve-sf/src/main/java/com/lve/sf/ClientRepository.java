package com.lve.sf;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ClientRepository extends JpaRepository<Client, Integer> {

    Optional<Client> findByClientRef(String clientRef);

    boolean existsByClientRef(String clientRef);
}
