import React, { useEffect, useState, useCallback } from "react";
import { apiFetch } from "../api/client";
import { useAuth } from "../auth/AuthProvider";
import { Card } from "../components/Card";
import { Button } from "../components/Button";
import { SectionModal, SectionData } from "../components/SectionModal";

export function SectionsPage(): React.JSX.Element {
  const [sections, setSections] = useState<SectionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<SectionData | undefined>(
    undefined
  );

  const auth = useAuth();

  const fetchSections = useCallback(() => {
    setLoading(true);
    void apiFetch<SectionData[]>("/sections")
      .then((data) => {
        if (Array.isArray(data)) {
          setSections(data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchSections();
  }, [fetchSections]);

  const handleCreate = () => {
    setEditingSection(undefined);
    setIsModalOpen(true);
  };

  const handleEdit = (section: SectionData) => {
    setEditingSection(section);
    setIsModalOpen(true);
  };

  const handleSave = async (data: SectionData) => {
    const method = editingSection ? "PUT" : "POST";
    const url = editingSection ? `/sections/${editingSection.id}` : "/sections";

    try {
      await apiFetch(url, {
        method,
        body: data,
        csrfToken: auth.csrfToken ?? undefined,
      });
      fetchSections();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Вы уверены, что хотите удалить эту секцию?")) return;
    try {
      await apiFetch(`/sections/${id}`, {
        method: "DELETE",
        csrfToken: auth.csrfToken ?? undefined,
      });
      fetchSections();
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Секции
        </h1>
        <Button variant="primary" onClick={handleCreate}>
          Добавить секцию
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {sections.map((section) => (
          <div key={section.id} className="relative group">
            <Card title={section.title}>
              <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3">
                {section.summary}
              </p>
              <div className="mt-4 flex justify-between items-center">
                <span className="text-xs text-gray-400">ID: {section.id}</span>
                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleEdit(section)}>
                    Изменить
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(section.id)}>
                    Удалить
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        ))}
      </div>
      <SectionModal
        key={editingSection ? editingSection.id : "new"}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        initialData={editingSection}
      />
    </div>
  );
}
