import React, { useState } from "react";
import { Button } from "./Button";
import { goalOptions } from "../constants/goals";

interface SectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (section: SectionData) => Promise<void>;
  initialData?: SectionData;
}

export interface SectionData {
  id: string;
  title: string;
  summary: string;
  focus: string[];
  format: string;
  contactLevel: string;
  intensity: string;
  recommendedFor: { fitnessLevel?: string; note: string }[];
  expectedResults: { shortTerm: string; midTerm: string; longTerm: string };
  extraBenefits: string[];
  prerequisites: string;
  imagePath: string;
  locationHint: string;
}

export function SectionModal({
  isOpen,
  onClose,
  onSave,
  initialData,
}: SectionModalProps): React.JSX.Element | null {
  const [formData, setFormData] = useState<SectionData>(
    initialData || {
      id: "",
      title: "",
      summary: "",
      focus: [],
      format: "mixed",
      contactLevel: "nonContact",
      intensity: "medium",
      recommendedFor: [],
      expectedResults: { shortTerm: "", midTerm: "", longTerm: "" },
      extraBenefits: [],
      prerequisites: "",
      imagePath: "",
      locationHint: "",
    }
  );

  if (!isOpen) return null;

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-xl dark:bg-slate-800">
        <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
          {initialData ? "Редактировать секцию" : "Новая секция"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                ID
              </label>
              <input
                name="id"
                value={formData.id}
                onChange={handleChange}
                disabled={!!initialData}
                className="mt-1 block w-full rounded-md border border-gray-300 p-2 dark:bg-slate-700 dark:border-slate-600"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Название
              </label>
              <input
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 p-2 dark:bg-slate-700 dark:border-slate-600"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Описание
            </label>
            <textarea
              name="summary"
              value={formData.summary}
              onChange={handleChange}
              rows={3}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 dark:bg-slate-700 dark:border-slate-600"
              required
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Формат
              </label>
              <select
                name="format"
                value={formData.format}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 p-2 dark:bg-slate-700 dark:border-slate-600">
                <option value="individual">Индивидуально</option>
                <option value="group">Группа</option>
                <option value="mixed">Смешанный</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Контакт
              </label>
              <select
                name="contactLevel"
                value={formData.contactLevel}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 p-2 dark:bg-slate-700 dark:border-slate-600">
                <option value="nonContact">Нет контакта</option>
                <option value="lightContact">Легкий</option>
                <option value="fullContact">Полный</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Интенсивность
              </label>
              <select
                name="intensity"
                value={formData.intensity}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 p-2 dark:bg-slate-700 dark:border-slate-600">
                <option value="low">Низкая</option>
                <option value="medium">Средняя</option>
                <option value="high">Высокая</option>
              </select>
            </div>
          </div>

          {/* Simplified JSON fields for MVP */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Цели
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-60 overflow-y-auto rounded-md border border-gray-300 p-2 dark:bg-slate-700 dark:border-slate-600">
              {Object.values(goalOptions).map(({ tag, label }) => (
                <label
                  key={tag}
                  className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.focus.includes(tag)}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      setFormData((prev) => ({
                        ...prev,
                        focus: checked
                          ? [...prev.focus, tag]
                          : prev.focus.filter((t) => t !== tag),
                      }));
                    }}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-slate-500 dark:bg-slate-600"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Изображение
            </label>
            <div className="mt-1 flex items-center gap-4">
              <input
                type="file"
                accept="image/*"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;

                  const formData = new FormData();
                  formData.append("file", file);

                  try {
                    const res = await fetch("/api/upload", {
                      method: "POST",
                      body: formData,
                    });
                    const data = await res.json();
                    if (data.success) {
                      setFormData((prev) => ({
                        ...prev,
                        imagePath: data.path,
                      }));
                    }
                  } catch (err) {
                    console.error("Upload failed", err);
                  }
                }}
                className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-sky-50 file:text-sky-700 hover:file:bg-sky-100"
              />
              {formData.imagePath && (
                <span className="text-xs text-green-600">
                  Загружено: {formData.imagePath}
                </span>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="secondary" onClick={onClose}>
              Отмена
            </Button>
            <Button type="submit" variant="primary">
              Сохранить
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
