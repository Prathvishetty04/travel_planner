package com.travelplanner.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.json.JSONObject;

@Service
public class WikipediaImageService {

    private final RestTemplate restTemplate;

    @Autowired
    public WikipediaImageService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public String getImageUrl(String title) {
        try {
            String url = "https://en.wikipedia.org/api/rest_v1/page/summary/" + title.replace(" ", "_");
            String json = restTemplate.getForObject(url, String.class);

            if (json != null) {
                JSONObject obj = new JSONObject(json);
                if (obj.has("thumbnail")) {
                    return obj.getJSONObject("thumbnail").getString("source");
                }
            }
        } catch (Exception e) {
            System.err.println("Failed to fetch Wikipedia image for: " + title);
        }

        return null;
    }
}
