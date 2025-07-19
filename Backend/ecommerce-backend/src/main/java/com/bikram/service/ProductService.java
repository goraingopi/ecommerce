package com.bikram.service;

import java.util.List;

import com.bikram.entity.Product;

public interface ProductService {

	Product addProduct(Product product);
	List<Product> getAllProducts();
	Product getProductById(Long id);
	void deleteProduct(Long id);
}
