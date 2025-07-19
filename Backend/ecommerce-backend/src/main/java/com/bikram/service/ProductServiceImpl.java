package com.bikram.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.bikram.entity.Product;
import com.bikram.repository.ProductRepository;

@Service
public class ProductServiceImpl implements ProductService {

	@Autowired
	private ProductRepository repository;
	@Override
	public Product addProduct(Product product) {
		return repository.save(product);
	}
	@Override
	public List<Product> getAllProducts() {
		// TODO Auto-generated method stub
		return repository.findAll();
	}
	@Override
	public Product getProductById(Long id) {
		// TODO Auto-generated method stub
		return repository.findById(id).orElse(null);
	}
	@Override
	public void deleteProduct(Long id) {
		// TODO Auto-generated method stub
		 repository.deleteById(id);
		 return;
		 
	}

	
}
