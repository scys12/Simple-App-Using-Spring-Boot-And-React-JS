package com.its.samuel.carikom.payload.request;

import lombok.Data;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import java.util.Set;

@Data
public class SignupRequest {
    @NotBlank
    @Size(min = 3, max = 20)
    private String username;
    @NotBlank @Size(max = 50)
    @Email
    private String email;
    @NotBlank
    private String lokasi;
    @NotBlank
    private String nama;
    @NotBlank
    private String telepon;

    private Set<String> roles;

    @NotBlank
    @Size(min = 3, max = 40)
    private String password;
}
