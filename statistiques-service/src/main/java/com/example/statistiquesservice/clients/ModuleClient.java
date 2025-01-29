package com.example.statistiquesservice.clients;


import com.example.statistiquesservice.config.FeignClientConfiguration;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;



@FeignClient(name = "module-service", configuration = FeignClientConfiguration.class)
public interface ModuleClient {


    @GetMapping("/api/modules/count")
    long getTotalModules();


}
