package com.its.samuel.carikom.controller;

import com.its.samuel.carikom.model.Category;
import com.its.samuel.carikom.model.Item;
import com.its.samuel.carikom.model.User;
import com.its.samuel.carikom.payload.response.MessageResponse;
import com.its.samuel.carikom.repository.CategoryRepository;
import com.its.samuel.carikom.repository.ItemRepository;
import com.its.samuel.carikom.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;
import java.security.Principal;
import java.util.Collection;
import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api")
public class ItemController {
    @Autowired
    private ItemRepository itemRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/items")
    Page<Item> items(Pageable pageable) {
        return itemRepository.findByIsBought(0, pageable);
    }

    @GetMapping("/item/{id}")
    ResponseEntity<?> getItem(@PathVariable Long id) {
        Optional<Item> item = itemRepository.findById(id);
        return item.map(response -> ResponseEntity.ok().body(response))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

//    @GetMapping("/carikom/item/{userOwner}/{name}")
//    ResponseEntity<?> getItemBasedOnItemName(@PathVariable Long userOwner, @PathVariable String name) {
//        Optional<Item> item = itemRepository.findByName(name);
//        return item.map(response -> ResponseEntity.ok().body(response))
//                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
//    }

//    @GetMapping("/carikom/item/{userOwner}/{category}")
//    ResponseEntity<?> getItemBasedOnCategory(@PathVariable Long userOwner, @PathVariable Long category) {
//        Collection<Item> item = itemRepository.findByUserOwnerAndCategory(userOwner, category);
//        return item.stream().map(response -> ResponseEntity.ok().body(response))
//
//    }

    @GetMapping("/item/user/{userId}")
    Page<Item> getItemBasedOnUserOwner(@PathVariable(value = "userId") Long userId, Pageable pageable) {
        return itemRepository.findByUserId(userId, pageable);
    }

    @PostMapping("/item")
    Item createItem(@Valid @RequestBody Item item, Principal principal) throws URISyntaxException {
        Optional<User> userItem = userRepository.findByUsername(principal.getName());
        return userItem.map( user -> {
            item.setUser(user);
            return itemRepository.save(item);
        }).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
    }

    @PutMapping("/item/edit")
    Item updateItem(@Valid @RequestBody Item item,Principal principal) {
        Optional<User> userItem = userRepository.findByUsername(principal.getName());
        return userItem.map( user -> {
            item.setUser(user);
            return itemRepository.save(item);
        }).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
    }

    @DeleteMapping("/item/delete/{id}")
    ResponseEntity<Item> deleteItem(@PathVariable Long id) {
        itemRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/latestitem")
    List<Item> getLatestItem(Pageable pageable){
        List<Item> items = itemRepository.findByIsBoughtOrderByIdDesc();
        return items;
    }
}