class IPEEngine:
    @staticmethod
    def calculate_metrics(soja_preds: list, milho_sim: list, arroz_sim: list, capacity: int):
        """
        Unifica as predições e calcula o IPE mensal (SSoT no Backend).
        """
        combined_data = []
        pico_total = 0

        for i in range(12):
            s = soja_preds[i]["soja"]
            m = milho_sim[i]
            a = arroz_sim[i]
            total = s + m + a
            
            pico_total = max(pico_total, total)
            
            combined_data.append({
                "name": soja_preds[i]["date"],
                "soja": s,
                "milho": m,
                "arroz": a,
                "total": round(total, 2),
                "ipe": round((total / capacity) * 100, 2)
            })

        current_ipe = round((pico_total / capacity) * 100, 2)
        
        return {
            "chartData": combined_data,
            "overallIPE": current_ipe,
            "picoTotal": pico_total
        }
