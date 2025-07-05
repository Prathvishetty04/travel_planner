package com.travelplanner.repository;

import com.travelplanner.entity.Destination;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DestinationRepository extends JpaRepository<Destination, Long> {
    List<Destination> findByCategory(Destination.Category category);
    
    @Query("SELECT d FROM Destination d WHERE " +
           "LOWER(d.name) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(d.city) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(d.country) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    List<Destination> findBySearchTerm(@Param("searchTerm") String searchTerm);
    
    @Query("SELECT d FROM Destination d WHERE d.category = :category AND " +
           "(LOWER(d.name) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(d.city) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(d.country) LIKE LOWER(CONCAT('%', :searchTerm, '%')))")
    List<Destination> findByCategoryAndSearchTerm(@Param("category") Destination.Category category, 
                                                  @Param("searchTerm") String searchTerm);
}
