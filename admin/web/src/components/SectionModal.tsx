import React, { useState } from "react";
import { Button } from "./Button";
import { apiFetch } from "../api/client";
import { useAuth } from "../auth/AuthProvider";
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
  const auth = useAuth();
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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm">
      {/* Use items-start so very tall content begins at top and the modal scrolls; center on medium+ screens */}
      <div className="flex min-h-screen items-start md:items-center justify-center p-6 text-center">
        {/* Make dialog wider and limit max height so it becomes scrollable when content is large */}
        <div className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all dark:bg-slate-800 max-h-[calc(100vh-6rem)] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {initialData ? "Редактировать секцию" : "Новая секция"}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {formData.imagePath && (
            <div className="mb-6 flex justify-center bg-gray-100 dark:bg-slate-900 rounded-lg p-2">
              <img
                src={
                  formData.imagePath.startsWith(".")
                    ? formData.imagePath.substring(1)
                    : formData.imagePath
                }
                alt={formData.title}
                className="h-64 w-full object-contain rounded-lg"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            </div>
          )}

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
                    className="flex items-center space-x-3 cursor-pointer rounded-md p-2 hover:bg-gray-50 dark:hover:bg-slate-700">
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
                      className="h-4 w-4 rounded border-gray-300 text-sky-600 focus:ring-sky-500 dark:border-slate-600 dark:bg-slate-700 accent-sky-600"
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
                      const data = await apiFetch<{
                        success: boolean;
                        path: string;
                      }>("/upload", {
                        method: "POST",
                        body: formData,
                        csrfToken: auth.csrfToken ?? undefined,
                      });
                      if (data?.success) {
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
    </div>
  );
}
