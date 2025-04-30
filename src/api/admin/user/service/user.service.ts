import { UpdateStatus } from './../dto/updateStatus.dto';
// src/user/user.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/database/entities/user/user.entity';
import { EUserRole } from 'src/enums/user.enums';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getAllUsers(): Promise<User[]> {
    return await this.userRepository.find({
      where: { role: EUserRole.USER },
    });
  }

  async updateUserStatus(
    userId: number,
    updateStatus: UpdateStatus,
  ): Promise<User | null> {
    const currentUser = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!currentUser) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }

    currentUser.status = updateStatus.status;

    return this.userRepository.save(currentUser);
  }
}
