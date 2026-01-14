package com.hairhub.backend.domain.business;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WorkerScheduleRepository extends JpaRepository<WorkerSchedule, Long> {

    List<WorkerSchedule> findByWorkerId(Long workerId);

    List<WorkerSchedule> findByWorkerIdAndAvailableTrue(Long workerId);
}
