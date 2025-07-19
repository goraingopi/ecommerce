package com.bikram.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.bikram.entity.Product;

public interface ProductRepository extends JpaRepository<Product, Long> {

	
}
