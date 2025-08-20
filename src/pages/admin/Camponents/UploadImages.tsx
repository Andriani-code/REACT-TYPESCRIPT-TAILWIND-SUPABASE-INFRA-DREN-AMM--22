import React, { useState } from 'react';
// Assurez-vous que le chemin est correct pour votre client Supabase
 // Assurez-vous que le chemin est correct pour vos types
import { v4 as uuidv4 } from 'uuid'; // Pour générer un identifiant unique pour chaque image
import { FaTimesCircle } from 'react-icons/fa'; // Exemple d'icône de suppression
import { MdOutlineImage } from 'react-icons/md';
import type { Etablissement } from '../../../types/types';
import supabase from '../../../helper/SupabaseClient';

interface Props {
  codeetab: Etablissement;
}

const UploadImage: React.FC<Props> = ({ codeetab }) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setSelectedFiles(prevFiles => [...prevFiles, ...files]);

      const previews = files.map(file => URL.createObjectURL(file));
      setImagePreviews(prevPreviews => [...prevPreviews, ...previews]);
      setError('');
    }
  };

  const handleRemoveImage = (index: number) => {
    setSelectedFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
    setImagePreviews(prevPreviews => prevPreviews.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      setError('Veuillez choisir au moins une image.');
      return;
    }

    setLoading(true);
    setError('');

    const imageUrls: { id: string; url: string }[] = [];

    try {
      for (const file of selectedFiles) {
        const fileId = uuidv4();
        const { data, error: uploadError } = await supabase.storage
          .from('images') // Nom de votre bucket Supabase
          .upload(`etablissement_images/${fileId}-${file.name}`, file, {
            cacheControl: '3600',
            upsert: false,
          });

        if (uploadError) {
          throw new Error(uploadError.message);
        }

        // Construction de l'URL publique de l'image
        const { data: publicUrlData } = supabase.storage
          .from('images')
          .getPublicUrl(data.path);

        imageUrls.push({
          id: fileId,
          url: publicUrlData.publicUrl,
        });
      }

      // Mise à jour de la table 'etablissement' avec les nouvelles images
      const { data: updateData, error: updateError } = await supabase
        .from('etablissement')
        .update({
          images: imageUrls,
        })
        .eq('codeetab', codeetab.codeetab);

      if (updateError) {
        throw new Error(updateError.message);
      }

      alert('Images enregistrées avec succès !');

      // Réinitialiser l'état après le téléchargement réussi
      setSelectedFiles([]);
      setImagePreviews([]);
    } catch (err: any) {
      console.error('Erreur lors du téléchargement des images:', err.message);
      setError('Erreur lors de l\'enregistrement des images. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center p-4 border rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Télécharger des images pour l'établissement</h2>

      {/* Prévisualisations des images */}
      <div className="flex flex-wrap gap-2 mb-4 justify-center">
        {imagePreviews.map((preview, index) => (
          <div key={index} className="relative w-24 h-24">
            <img src={preview} alt={`preview-${index}`} className="w-full h-full object-cover rounded-md" />
            <button
              onClick={() => handleRemoveImage(index)}
              className="absolute top-1 right-1 text-red-500 bg-white rounded-full p-1 leading-none"
              title="Supprimer l'image"
            >
              <FaTimesCircle size={20} />
            </button>
          </div>
        ))}
      </div>

      <div className="flex items-center space-x-2">
        {/* Bouton de sélection d'images */}
        <label htmlFor="file-upload" className="cursor-pointer bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300 flex items-center">
          <MdOutlineImage className="mr-2" />
          Choisir des images
        </label>
        <input
          id="file-upload"
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />

        {/* Bouton d'enregistrement */}
        <button
          onClick={handleUpload}
          disabled={loading}
          className="bg-green-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Enregistrement...' : 'Enregistrer'}
        </button>
      </div>

      {/* Message d'erreur */}
      {error && <small className="text-red-500 mt-2">{error}</small>}
    </div>
  );
};

export default UploadImage;