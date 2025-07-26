import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AttributeValue } from 'src/database/entities/attribute/attribute-value.entity';
import { Repository } from 'typeorm';
import { CreateAttributeValueInDto } from '../dto/create-attribute-value.in.dto';
import { UpdateAttributeValueInDto } from '../dto/update-attribute-value.in.dto';

@Injectable()
export class AttributeValueService {
  constructor(
    @InjectRepository(AttributeValue)
    private attributeValueRepository: Repository<AttributeValue>,
  ) {}

  async create(dto: CreateAttributeValueInDto): Promise<AttributeValue> {
    const value = this.attributeValueRepository.create(dto);
    return this.attributeValueRepository.save(value);
  }

  async findAll(): Promise<AttributeValue[]> {
    return this.attributeValueRepository.find();
  }

  async findById(id: number): Promise<AttributeValue> {
    const value = await this.attributeValueRepository.findOne({
      where: { id },
    });
    if (!value) throw new NotFoundException('Attribute value not found');
    return value;
  }

  async update(
    id: number,
    dto: UpdateAttributeValueInDto,
  ): Promise<AttributeValue> {
    await this.findById(id);
    await this.attributeValueRepository.update(id, dto);
    return this.findById(id);
  }

  async remove(id: number): Promise<void> {
    await this.findById(id);
    await this.attributeValueRepository.delete(id);
  }
}
