sed -i '/const \[businessCategory, setBusinessCategory\] = useState('\'''\'');/a\
  const [propertyType, setPropertyType] = useState<'\''apartment'\'' | '\''development'\''>('\''apartment'\'');\
  const [streetAddress, setStreetAddress] = useState('\'''\'');\
  const [buildingNumber, setBuildingNumber] = useState('\'''\'');\
  const [apartmentNumber, setApartmentNumber] = useState('\'''\'');\
  const [voin, setVoin] = useState('\'''\'');' src/components/AuthScreen.tsx

sed -i '/if (accountType === '\''business'\'' && (!businessName || !businessCategory)) {/c\
    if (!streetAddress || !buildingNumber) {\
      setError('\''Please provide your street address and building number.'\'');\
      return;\
    }\
    if (accountType === '\''business'\'') {\
      if (!businessName || !businessCategory || !voin) {\
        setError('\''Please fill in all business details including VOIN.'\'');\
        return;\
      }\
    }' src/components/AuthScreen.tsx
