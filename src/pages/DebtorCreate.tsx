
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Star, ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';

const DebtorCreate = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [phoneNumbers, setPhoneNumbers] = useState(['']);
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [images, setImages] = useState<string[]>([]);

  const handleAddPhone = () => {
    setPhoneNumbers([...phoneNumbers, '']);
  };

  const handlePhoneChange = (index: number, value: string) => {
    const updatedPhones = [...phoneNumbers];
    updatedPhones[index] = value;
    setPhoneNumbers(updatedPhones);
  };

  const handleSubmit = () => {
    if (!name) {
      toast({
        variant: "destructive",
        title: "Ism kiritilmadi",
        description: "Iltimos, ism kiriting",
      });
      return;
    }

    if (!phoneNumbers[0]) {
      toast({
        variant: "destructive",
        title: "Telefon raqami kiritilmadi",
        description: "Iltimos, telefon raqami kiriting",
      });
      return;
    }

    // Instead of an actual API call, we'll just move to the success step
    setStep(3);

    // In real implementation, you would call the API here:
    // const newDebtor = { name, phoneNumbers, address, notes, images };
    // await debtors.create(newDebtor);
  };

  const renderStep1 = () => (
    <>
      <div className="p-4 bg-white border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button 
              onClick={() => navigate(-1)}
              className="mr-4"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-xl font-semibold">Mijoz yaratish</h1>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4 overflow-auto flex-1">
        <div className="space-y-2">
          <label className="block text-sm font-medium">
            Ismi <span className="text-red-500">*</span>
          </label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ismini kiriting"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">
            Telefon raqami <span className="text-red-500">*</span>
          </label>
          {phoneNumbers.map((phone, index) => (
            <div key={index} className="mb-2">
              <Input
                value={phone}
                onChange={(e) => handlePhoneChange(index, e.target.value)}
                placeholder="Telefon raqami"
              />
            </div>
          ))}
          <button 
            onClick={handleAddPhone}
            className="text-blue-500 text-sm flex items-center"
          >
            <span>+ Koʻproq qoʻshish</span>
          </button>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">
            Yashash manzili
          </label>
          <Textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Yashash manzilini kiriting"
          />
        </div>

        <button 
          onClick={() => setStep(2)}
          className="bg-white border rounded-md p-4 w-full text-center"
        >
          Eslatma qoʻshish
        </button>

        <div className="space-y-2">
          <label className="block text-sm font-medium">
            Rasm biriktirish
          </label>
          <div className="grid grid-cols-2 gap-2">
            <div className="border rounded-md h-20 flex items-center justify-center">
              <div className="text-center">
                <ImageIcon className="mx-auto" size={20} />
                <span className="text-sm">Rasm qoʻshish</span>
              </div>
            </div>
            <div className="border rounded-md h-20 flex items-center justify-center">
              <div className="text-center">
                <ImageIcon className="mx-auto" size={20} />
                <span className="text-sm">Rasm qoʻshish</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 bg-white border-t">
        <Button 
          onClick={handleSubmit}
          className="w-full py-6"
        >
          Saqlash
        </Button>
      </div>
    </>
  );

  const renderStep2 = () => (
    <>
      <div className="p-4 bg-white border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button 
              onClick={() => setStep(1)}
              className="mr-4"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-xl font-semibold">Mijoz yaratish</h1>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4 overflow-auto flex-1">
        <div className="space-y-2">
          <label className="block text-sm font-medium">
            Ismi <span className="text-red-500">*</span>
          </label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ismini kiriting"
            readOnly
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">
            Telefon raqami <span className="text-red-500">*</span>
          </label>
          {phoneNumbers.map((phone, index) => (
            <div key={index} className="mb-2">
              <Input
                value={phone}
                readOnly
              />
            </div>
          ))}
          <button 
            onClick={handleAddPhone}
            className="text-blue-500 text-sm flex items-center"
          >
            <span>+ Koʻproq qoʻshish</span>
          </button>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">
            Yashash manzili
          </label>
          <Input
            value={address}
            readOnly
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">
            Eslatma
          </label>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Affiristarqa qoldi kunim"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">
            Rasm biriktirish
          </label>
          <div className="grid grid-cols-3 gap-2">
            <div className="relative border rounded-md overflow-hidden">
              <img 
                src="/lovable-uploads/950fd513-dc59-456f-bcfd-926765877e8e.png" 
                alt="Document 1"
                className="w-full h-20 object-cover"
              />
              <div className="absolute bottom-0 right-0 bg-black/50 text-white text-xs p-1">
                2 zamin
              </div>
            </div>
            <div className="relative border rounded-md overflow-hidden">
              <img 
                src="/lovable-uploads/21b28884-3664-4379-b27f-a9f28f6a0bb6.png" 
                alt="Document 2"
                className="w-full h-20 object-cover"
              />
              <div className="absolute bottom-0 right-0 bg-black/50 text-white text-xs p-1">
                2 guvohnoma
              </div>
            </div>
            <div className="relative border rounded-md overflow-hidden">
              <img 
                src="/lovable-uploads/35503fc4-ca7f-490a-af7c-6ca1d29d7431.png" 
                alt="Document 3"
                className="w-full h-20 object-cover"
              />
              <div className="absolute bottom-0 right-0 bg-black/50 text-white text-xs p-1">
                2 shartnoma
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 bg-white border-t">
        <Button 
          onClick={handleSubmit}
          className="w-full py-6"
        >
          Saqlash
        </Button>
      </div>
    </>
  );

  const renderStep3 = () => (
    <div className="flex flex-col items-center justify-center h-full p-8 text-center">
      <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center mb-8">
        <svg width="42" height="32" viewBox="0 0 42 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M14.25 25.2812L3.9375 14.9688L0 18.9062L14.25 33.1562L42 5.40625L38.0625 1.46875L14.25 25.2812Z" fill="white"/>
        </svg>
      </div>
      <h1 className="text-2xl font-bold text-blue-500 mb-4">Ajoyib!</h1>
      <p className="text-gray-600 mb-8">Muvaffaqiyatli so'ndirildi</p>
      <Button 
        onClick={() => navigate('/debtors')}
        className="w-full py-6"
      >
        Ortga
      </Button>
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {step === 1 && renderStep1()}
      {step === 2 && renderStep2()}
      {step === 3 && renderStep3()}
    </div>
  );
};

export default DebtorCreate;
