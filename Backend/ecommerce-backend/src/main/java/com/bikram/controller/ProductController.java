package com.bikram.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bikram.entity.Product;
import com.bikram.service.ProductService;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "*")
public class ProductController {

	@Autowired
	private ProductService productService;
	
	@PostMapping("/addproduct")
	public Product create(@RequestBody Product product) {
		return productService.addProduct(product);
	}
	
	@GetMapping("/getallproducts")
	public List<Product> getAll(){
		return productService.getAllProducts();
	}
	
	@GetMapping("/{id}")
	public Product getById(@PathVariable Long id) {
		return productService.getProductById(id);
	}
	
	@DeleteMapping("/{id}")
	public void delete(@PathVariable Long id) {
		productService.deleteProduct(id);
		return; 
	}
}
